<template>
  <div class="calendar-container ms-time ms-editor ms-validate w-full">
    <div class="flex">
      <label class="label mb-2" v-if="label">{{ label }}</label>
      <div
        v-if="rules && rules.find((_ : any) => _?.name == 'required')"
        class="ms-textarea-required"
      >
        &nbsp;{{ textRequired }}
      </div>
    </div>
    <div ref="buttonContainer" class="form-input">
      <input
        ref="input"
        class="ms-input--datepicker input flex"
        :value="rawValue"
        :tabindex="0"
        :autofocus="autofocus"
        :disabled="disabled"
        :class="{ disabled: disabled, 'input-error': errorMessage }"
        :readOnly="readOnly"
        :placeholder="placeholder"
        v-on="listeners"
        @keydown="onKeydown"
      />
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { getCurrentInstance } from "vue";
import msBaseComponent from "@/components/base/MsBaseComponent.vue";
import { useValidateControl } from "@/setup/validateControl";
import moment from "moment";
import IMask from "imask";

export default {
  extends: msBaseComponent,
  props: {
    autofocus: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      required: false,
      default: null,
    },

    hasTimeInfo: {
      type: Boolean,
      default: false,
    },

    /**
     * Theo chuẩn của momentJS
     * VD: Nếu có full datetime:
     *  - DD/MM/YYYY HH:mm (20/01/2020 15:03:45)
     *  - DD/MM/YYYY HH:mm:ss A (20/01/2020 15:03:45)
     */
    format: {
      type: String,
      default: "HH:mm:ss",
    },

    /**
     * Loại date picker
     * @values 'secondary'
     * Created by: pvduong1 - 15/10/2019
     */
    type: {
      type: String,
      default: "",
    },
    /**
     * placeholder của ô input
     * nktiem 19/05/2023
     */
    placeholder: {
      type: String,
      default: "HH:mm",
    },
    defaultTime: {
      type: String,
      default: null,
    },
    min: {},
    max: {},
    /*
     * Hàm show ra câu thông báo riêng theo từng trường hợp
     * pvduy 18/03/2021
     * ví dụ: customWarring {rules:'required', mes: 'Tài sản này là của pvduy'}
     */
    customWarring: {
      type: Object,
      default: null,
    },
    // Xác định xem input có border hay không?
    hasBorder: {
      default: true,
      type: Boolean,
    },

    /**
     * Kí hiệu cảnh báo trường bắt buộc nhập không được bỏ trống
     */
    textRequired: {
      type: String,
      default: "*",
      required: false,
    },
  },
  computed: {
    listeners() {
      const me: any = this;
      return {
        input: (e) => {
          if (
            e.target.value == "__:__" ||
            e.target.value == "_:__" ||
            !e.target.value
          ) {
            me.$nextTick(() => {
              me.updateVModel(null);
            });
          }
        },
        change: (e) => {
          me.onChange(e);
        },
        // focus: (e) => {
        //   me.onFocus(e);
        // },
        blur: (e) => {
          me.onBlur(e);
        },
        keydown: (e) => {
          // e.stopPropagation();
          me.$emit("msKeydown", e);
        },
        focus: (e) => {
          me.momentMask.updateOptions({ lazy: false });
        },
        focusout: (e) => {
          me.momentMask.updateOptions({ lazy: true });
        },
      };
    },
  },

  watch: {
    modelValue: {
      immediate: true,
      handler(newVal, oldVal) {
        const me: any = this;
          me.setDefaultTime(newVal);
          me.setRawValue(newVal);
      },
    },
    min: {
      immediate: true,
      handler(newVal, oldVal) {
        const me: any = this;
        if (newVal) {
          me.updateMomentMask();
        }
      },
    },
  },

  data() {
    return {
      topx: 0,
      leftx: 0,
      focused: false,
      rawValue: "",
    };
  },
  methods: {
    /**
     * bổ sung phím tắt mũi tên tăng giảm ngày tháng năm
     * 21.07.2023
     */
    onKeydown(e) {
      let me: any = this;
      switch (e.which) {
        case 38: //Mũi tên lên
          me.handleArrowKeyUpDown(e, true);
          break;
        case 40: //Mũi tên xuống
          me.handleArrowKeyUpDown(e, false);
          break;
        default:
          break;
      }
    },
    /**
     * dqduy 21.07.2023
     * Tăng giảm ngày, tháng, năm bằng mũi tên lên xuống
     * act: Hành động tăng hay giảm (True - tăng, false - giảm)
     * Cấu trúc chuỗi text : dd/MM/YYYY (0 - 10)
     */
    handleArrowKeyUpDown(e, act) {
      let me: any = this,
        maskValue = me.momentMask.value,
        checkFormat = maskValue.slice(0, 10).match(/\//g); //Lấy ra ngày tháng năm rồi kiểm tra
      if (checkFormat && checkFormat.length == 2) {
        let posCur = e.target.selectionStart, // Vị trí con trỏ chuột
          dataDate = maskValue.slice(0, 10).split("/"),
          start = 0,
          end = 0; // 2 biến đầu cuối để bôi đen vùng ảnh hưởng cho nó giống tây
        if (e.target.selectionEnd > 9 && posCur == 0) {
          //Nếu đang bôi đen toàn bộ vùng ngày/tháng/năm
          posCur = e.target.selectionEnd;
        }
        if (posCur <= 2) {
          // Con trỏ đang nằm ở vị trí ngày
          if (Number(dataDate[0])) {
            start = 0;
            end = 2;
            switch (act) {
              case true:
                if (Number(dataDate[1])) {
                  let maxDay = 31;
                  switch (Number(dataDate[1])) {
                    case 2:
                      let year = Number(dataDate[2]);
                      if (
                        year &&
                        ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)
                      ) {
                        // năm nhuận
                        maxDay = 29;
                      } else {
                        maxDay = 28;
                      }
                      break;
                    case 4:
                    case 6:
                    case 9:
                    case 11:
                      maxDay = 30;
                      break;
                  }
                  if (dataDate[0] < maxDay) {
                    dataDate[0] = Number(dataDate[0]) + 1;
                  }
                }
                break;
              case false:
                if (dataDate[0] > 1) {
                  dataDate[0] = Number(dataDate[0]) - 1;
                }
                break;
            }
            dataDate[0] = dataDate[0] + "";
            if (dataDate[0].length < 2) {
              dataDate[0] = "0" + dataDate[0];
            }
          }
        } else if (posCur <= 5) {
          //Con trỏ đang nằm ở vị trí tháng
          if (Number(dataDate[1])) {
            start = 3;
            end = 5;
            switch (act) {
              case true:
                if (dataDate[1] < 12) {
                  dataDate[1] = Number(dataDate[1]) + 1;
                }
                break;
              case false:
                if (dataDate[1] > 1) {
                  dataDate[1] = Number(dataDate[1]) - 1;
                }
                break;
            }
            dataDate[1] = dataDate[1] + "";
            if (dataDate[1].length < 2) {
              dataDate[1] = "0" + dataDate[1];
            }
          }
        } else {
          //Con trỏ đang nằm ở vị trí năm
          if (Number(dataDate[2])) {
            start = 6;
            end = 10;
            switch (act) {
              case true:
                dataDate[2] = Number(dataDate[2]) + 1;
                break;
              case false:
                if (dataDate[2] > 1) {
                  dataDate[2] = Number(dataDate[2]) - 1;
                }
                break;
            }
            dataDate[2] = dataDate[2] + "";
            if (dataDate[2].length < 4) {
              dataDate[2] = "0".repeat(4 - dataDate[2].length) + dataDate[2];
            }
          }
        }
        me.rawValue = dataDate.join("/") + me.rawValue.substring(10);
        me.momentMask.value = me.rawValue; //Update value mới cho cái imask để nó đỡ báo lỗi :(
        me.$nextTick(() => {
          e.target.selectionStart = posCur; //Đặt lại vị trí con trỏ
          me.$refs.input.setSelectionRange(start, end); //Bôi đen lại vùng ảnh hưởng
        });
        e.preventDefault(); //Ngăn không cho con trỏ chuột quay về đầu or cuối dòng vì input type đang là text
      }
    },
    /**
     * Thiết lập mesage khi dữ liệu rỗng
     */
    setError(message) {
      const me: any = this;
      setTimeout(() => {
        me.errorMessage = message;
      });
    },
    removeError() {
      let me: any = this;
      setTimeout(() => {
        me.errorMessage = "";
        me.errorProvider["isValid"] = false;
        me.errorProvider["message"] = "";
        me.errorProvider["element"] = this;
      });
    },

    setDefaultTime(value) {
      const me: any = this;
      if (me.defaultTime) {
        let splitTime = me.defaultTime.split(":");
        if (splitTime && splitTime.length == 3) {
          value.setHours(splitTime[0]);
          value.setMinutes(splitTime[1]);
          value.setSeconds(splitTime[2]);
        }
      }
    },

    /**
     * Cập nhật string vào control input phục vụ hiển thị
     */
    setRawValue(valueDte, force) {
      const me: any = this;

      if (valueDte) {
        let ret = valueDte;
        if(!(typeof valueDte === 'string')){
          ret = me.$ms.format.formatDateTimeFull(valueDte, me.format);
        }
        if (me.rawValue !== ret) {
          me.rawValue = ret;
        }
      } else {
        me.rawValue = null;
      }

      // bnduc: Nếu me.rawValue giá trị thì mới update
      //NCPHUOC: Thực hiện update về giá trị rỗng cho rawValue để hiển thị
      if (me.momentMask && me.momentMask.value != me.rawValue) {
        if (!me.rawValue) {
          me.momentMask.value = "";
        } else {
          me.momentMask.value = me.rawValue;
        }
      }
      // }
    },

    onFocus(e) {
      const me: any = this;
      me.focused = true;
    },
    onBlur(e) {
      const me: any = this;
      me.focused = false;
      me.$nextTick(() => {
        me.validate();
        me.$emit("onBlurActionDatePicker");
      });
    },
    onChange(e) {
      const me: any = this,
        momentMask = me.momentMask,
        masked = momentMask ? momentMask.masked : null,
        value = e.currentTarget.value;
      /**
       * Chốt chặn xử lý auto Gen ngày tháng theo text đang nhập dở
       */
      let newVal = me.autoNomalizeValue(value, masked);

      me.$nextTick(() => {
        if (newVal) {
          me.updateVModel(newVal);
        }
      });
      if (me.rules) {
        me.validate(me);
      }
    },

    // Phục vụ việc lấy ra giá trị để validate.
    getValue() {
      const me: any = this;
      return me.modelValue;
    },

    /**
     * Tự đọng cập nhật ngày khi control đang nhập dở ngày
     */
    autoNomalizeValue(value, masked) {
      const me: any = this;
      if (!masked.unmaskedValue) {
        me.updateVModel(null, me.modelValue, false);
      } else if (value && typeof value == "string" && masked) {
        if (!masked.isComplete && !masked.date) {
          let dte = me.nomalizeDateTime(value, masked);
          if (dte) {
            me.momentMask.value = me.$ms.format.formatDateTimeFull(
              dte,
              me.format
            );
          }
          return dte;
        } else {
          return me.nomalizeDateTime(value, masked);
        }
      }
      return null;
    },

    /**
     * Thực hiện chuẩn hóa DateTime từ string
     * @param {String/DateTime} str Chuỗi DateTime cần chuẩn hóa
     * @param {MaskedDate} masked Chuỗi DateTime cần chuẩn hóa
     */
    nomalizeDateTime(str, masked) {
      const me: any = this;
      try {
        if (str) {
          if (str instanceof Date) {
            return str;
          } else {
            if (masked && masked.rawInputValue) {
              let mo = masked.parse(masked.rawInputValue);
              if (mo && mo.isValid()) {
                let dte = mo.toDate(),
                  now = new Date();
                if (me.hasTimeInfo && dte && dte.getHours() == 0) {
                  dte.setHours(now.getHours());
                  dte.setMinutes(now.getMinutes());
                  dte.setSeconds(now.getSeconds());
                  dte.setMilliseconds(now.getMilliseconds());
                }

                if (dte < masked.min || dte > masked.max) {
                  dte.setFullYear(now.getFullYear());
                }
                if(dte){
                  dte = me.$ms.format.formatDateTimeFull(
                    dte,
                    me.format
                  );
                }

                return dte;
              }
            }
          }
        }
      } catch (ex) {
        console.error(ex);
      }
    },

    /**
     * Xử lý cập nhật vào v-model nếu đã hoàn thành việc nhập liệu
     */
    maskInputComplete() {
      const me: any = this,
        momentMask = me.momentMask,
        masked = momentMask ? momentMask.masked : null;

      if (masked && masked.isComplete && masked.date) {
        let ret = me.$ms.format.formatDateTimeFull(masked.date.toDate(), 'HH:mm:ss'),
          currentValue = me.$ms.format.formatDateTimeFull(me.modelValue, 'HH:mm:ss');
        me.updateVModel(ret, currentValue, true);
        me.$emit("changeValue", ret, currentValue);
      }
    },

    /**
     * Thực hiện gán value vào MsDatePicker
     * @param {Date} newVal Giá trị cần cập nhật
     * @param {Date} oldVal Giá trị cũ
     * @param {Boolean} changeBinding Thay đổi do binding 2 chiều
     * @private
     */
    updateVModel(newVal, oldVal, changeBinding = true) {
      const me: any = this;
      me.setRawValue(newVal);
      if (changeBinding) {
        me.$emit("msChange", newVal, me.oldDate);
      }
      me.$emit("update:modelValue", newVal);

      /** Xử lý sau khi cập nhật model */
      if (changeBinding) {
        me.$emit("afterChange", newVal, me.oldDate);
      }

      me.$nextTick(() => {
        if (me.rules) {
          me.validate(me);
        }
      });
    },
    initPicker() {
      const me: any = this;
      // document.body.appendChild(me.$refs.datepickerContent);
      let element = me.$refs.input,
        momentFormat = me.format,
        momentMask = IMask(element, {
          mask: Date,
          pattern: momentFormat,
          lazy: true,
          min: me.min || new Date(1700, 0, 1), // Sửa lại giới hạn ngày theo tài liệu
          max: me.max || new Date(9999, 12, 31),
          // autofix: true,

          format: function (date) {
            let ret = moment(date).format(momentFormat);
            return ret;
          },
          parse: function (str) {
            let ret = moment(str, momentFormat);
            return ret;
          },

          commit: me.momentMaskCommit,

          blocks: {
            YYYY: {
              mask: IMask.MaskedRange,
              from: 1,
              to: 9999,
            },
            MM: {
              mask: IMask.MaskedRange,
              from: 1,
              to: 12,
            },
            DD: {
              mask: IMask.MaskedRange,
              from: 1,
              to: 31,
              //maxLength: 2
            },
            HH: {
              mask: IMask.MaskedRange,
              from: 0,
              to: 23,
              //maxLength: 2
            },
            kk: {
              mask: IMask.MaskedRange,
              from: 0,
              to: 23,
              //maxLength: 2
            },
            mm: {
              mask: IMask.MaskedRange,
              from: 0,
              to: 59,
              //maxLength: 2
            },
            ss: {
              mask: IMask.MaskedRange,
              from: 0,
              to: 59,
              //maxLength: 2
            },
            A: {
              mask: IMask.MaskedEnum,
              enum: ["AM", "PM", "SA", "CH"],
            },
            a: {
              mask: IMask.MaskedEnum,
              enum: ["am", "pm", "sa", "ch"],
            },
          },
        });

      momentMask.on("complete", me.maskInputComplete);

      me.momentMask = momentMask;
    },
    /**
     * Cập nhật lại option min,max của momentMask
     * tbngoc 30.07.2022
     */
    updateMomentMask() {
      let me: any = this;
      let option = {
        min: me.min || new Date(1970, 0, 1), // Sửa lại giới hạn ngày theo tài liệu
        max: me.max || new Date(9999, 12, 31),
      };
      if (me.momentMask) {
        me.momentMask.updateOptions(option);
      }
    },
  },
  setup(props, context) {
    const { proxy }: any = getCurrentInstance();
    const { errorMessage, validate, isValidate } = useValidateControl({
      props,
    });

    return {
      errorMessage,
      validate,
      isValidate,
    };
  },
  mounted() {
    const me: any = this;
    me.initPicker();
  },

  created() {},

  beforeUnmount() {},
};
</script>

<style lang="scss" scoped>
@use "@/assets/scss/component/MsDatepicker.scss" as style;
</style>
