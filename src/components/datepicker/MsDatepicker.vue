<template>
  <div class="calendar-container ms-datepicker ms-editor ms-validate w-full">
    <div class="flex">
      <label class="label mb-2" v-if="label">{{ label }}</label>
      <div
        v-if="label && rules && rules.find((_ : any) => _?.name == 'required')"
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
      <div
        ref="elementIcon"
        @click="handleShowCalendar()"
        class="form-icon"
        :class="{ disabled: disabled }"
      ></div>
    </div>
    <teleport to="#app">
      <div 
        @click.stop="() => {}"
        ref="elementCalendar" 
        v-show="showCalendar" 
        :style="{
          left: style.left,
          top: style.top,
        }"
        class="calendar"
      >
        <div class="calendar-item calendar-date">
          <div class="info">
            <div
              @click="handlePrevMonth()"
              class="calendar-prev btn-handle"
            ></div>
            <span
              @click="showSelectYear = true"
              style="font-family: notosans-bold"
            >
              {{ $t("i18nControl.calendar.month") }} {{ currentMonth + 1 }}
              {{ $t("i18nControl.calendar.year") }} {{ currentYear }}</span
            >
            <div
              @click="handleNextMonth()"
              class="calendar-next btn-handle"
            ></div>
          </div>
          <div class="date">
            <div class="day-name">{{ $t("i18nControl.calendar.t") }}2</div>
            <div class="day-name">{{ $t("i18nControl.calendar.t") }}3</div>
            <div class="day-name">{{ $t("i18nControl.calendar.t") }}4</div>
            <div class="day-name">{{ $t("i18nControl.calendar.t") }}5</div>
            <div class="day-name">{{ $t("i18nControl.calendar.t") }}6</div>
            <div class="day-name">{{ $t("i18nControl.calendar.t") }}7</div>
            <div class="day-name">{{ $t("i18nControl.calendar.su") }}</div>
          </div>
          <div class="date date-container">
            <div v-for="(item, index) in startDay" class="day" :key="index"></div>
            <div
              v-for="(item, index) in daysInMonth"
              @click="handleSelectDate(item)"
              class="day day-value"
              :key="index"
              :class="{
                active:
                  currentDate === item &&
                  new Date(modelValue || '').getMonth() === currentMonth &&
                  new Date(modelValue || '').getFullYear() === currentYear,
                'date-now':
                  dateNow.getDate() === item &&
                  dateNow.getMonth() === currentMonth &&
                  dateNow.getFullYear() === currentYear,
              }"
            >
              {{ item }}
            </div>
          </div>
          <div class="info today">
            <span @click="handleSelectDate(true)">{{
              $t("i18nControl.calendar.today")
            }}</span>
          </div>
          <div
            v-show="showSelectMonth"
            ref="elementSelectMonth"
            class="calendar-item calendar-month"
          >
            <div class="calendar-select_header">
              <div @click="currentYear--" class="calendar-prev btn-handle"></div>
              <span
                style="cursor: pointer"
                @click="
                  showSelectMonth = false;
                  showSelectYear = true;
                "
                >{{ currentYear }}</span
              >
              <div @click="currentYear++" class="calendar-next btn-handle"></div>
            </div>
            <div class="calendar-select_content month">
              <div
                v-for="(item, index) in 12"
                :key="index"
                class="calendar-select_item"
              >
                <span @click="handleSelectMonth(item)"
                  >{{ $t("i18nControl.calendar.thg") }} {{ item }}</span
                >
              </div>
            </div>
            <div class="calendar-cancel">
              <span @click="handleShowCalendar()">{{
                $t("i18nCommon.cancel")
              }}</span>
            </div>
          </div>
          <div
            v-show="showSelectYear"
            ref="elementSelectYear"
            class="calendar-item calendar-year"
          >
            <div class="calendar-select_header">
              <div
                @click="currentYear = currentYear - 12"
                class="calendar-prev btn-handle"
              ></div>
              <span>{{ currentYear }} - {{ currentYear - 11 }}</span>
              <div
                @click="currentYear = currentYear + 12"
                class="calendar-next btn-handle"
              ></div>
            </div>
            <div class="calendar-select_content year">
              <div
                v-for="(item, index) in 12"
                :key="index"
                class="calendar-select_item"
                :class="{ active: currentYear === currentYear - item + 1 }"
              >
                <span @click="handleSelectYear(currentYear - item + 1)">{{
                  currentYear - item + 1
                }}</span>
              </div>
            </div>
            <div class="calendar-cancel">
              <span @click="handleShowCalendar()">{{
                $t("i18nCommon.cancel")
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts">
import {
  ref,
  toRefs,
  computed,
  watch,
  onUnmounted,
  getCurrentInstance,
} from "vue";
import msBaseComponent from "@/components/base/MsBaseComponent.vue";
import { useValidateControl } from "@/setup/validateControl";
import moment from "moment";
import IMask from "imask";
import componentUtil from "@/commons/componentUtil";

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
      default: "DD/MM/YYYY",
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
      default: "DD/MM/YYYY",
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
            e.target.value == "_/__/____" ||
            e.target.value == "__/__/____" ||
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
        if (typeof newVal == "string") {
          let newValDate = new Date(newVal);
          me.setDefaultTime(newValDate);
          me.updateVModel(newValDate, oldVal);
        } else {
          me.setDefaultTime(newVal);
          me.setRawValue(newVal);
        }
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
      valueDatePicker: this.modelValue ? this.modelValue : new Date(), // ngày thao tác với datepicker popup, định dạng Date
      internalValue: this.modelValue, // Model thao tác với validate, ko dùng cái valueDatePicker do nó có giá trị mặc định là ngày hiện tại
    };
  },
  methods: {
    /**
     * reset giá trị ban đầu control
     * @author dqduy 21.09.2023
     */
    reset() {
      let me: any = this;
      me.internalValue = null;
    },
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
    // Phục vụ việc lấy ra giá trị để validate.
    getValue() {
      const me: any = this;
      return me.internalValue;
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
     * Cập nhật string vào control input phục vụ hiển thị
     */
    setRawValue(valueDte, force) {
      const me: any = this;

      if (valueDte) {
        let ret = me.$ms.format.formatDateTimeFull(valueDte, me.format);
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

                return dte;
              }
            }
          }
        }
      } catch (ex) {
        console.error(ex);
      }
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
      // this.inputIsFocus = false;
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
          if (me.min && newVal.getTime() < me.min.getTime()) {
            newVal = new Date(me.min);
          } else {
            me.updateVModel(newVal);
          }
        }
      });
      if (me.rules) {
        me.validate(me);
      }
      //Đoạn này emit change ko cần thiết do trong updateVModel đã emit
      // this.$emit('msChange', newVal, me.oldDate);
      // this.typing = false;
    },

    /**
     * Xử lý cập nhật vào v-model nếu đã hoàn thành việc nhập liệu
     */
    maskInputComplete() {
      const me: any = this,
        momentMask = me.momentMask,
        masked = momentMask ? momentMask.masked : null;

      if (masked && masked.isComplete && masked.date) {
        let ret = masked.date.toDate(),
          retText = me.$ms.format.formatDateTimeFull(ret, me.format),
          currentValue = me.$ms.format.formatDateTimeFull(
            me.modelValue,
            me.format
          );
        // if (retText != currentValue) {
        me.updateVModel(ret, me.modelValue, true);
        // }
        //TVTHAI 15.9.2023: Emit khi thay đổi ngày hoặc nhập vào input date
        me.$emit("changeValue", ret, me.modelValue);
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
      me.internalValue = newVal;
      if (newVal) {
        me.valueDatePicker = newVal;
      } else {
        me.valueDatePicker = new Date();
      }
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
    setValue(value) {
      const me: any = this;
      if (value) {
        me.valueDatePicker = value;
        me.oldDate = new Date(me.valueDatePicker);
      } else {
        me.valueDatePicker = new Date();
        me.oldDate = null;
      }
      if (typeof value == "string") {
        let newValDate = new Date(value);
        me.updateVModel(newValDate, me.modelValue, false);
      } else {
        me.updateVModel(value, me.modelValue, false);
      }
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

    /**
     * Element calendar chọn ngày, tháng, năm
     * Khắc Tiềm - 15.09.2022
     */
    const elementCalendar: any = ref(null);
    /**
     * Element icon toggle ẩn hiện calendar
     * Khắc Tiềm - 15.09.2022
     */
    const elementIcon: any = ref(null);
    /**
     * Element chọn tháng
     * Khắc Tiềm - 15.09.2022
     */
    const elementSelectMonth: any = ref(null);
    /**
     * Element chọn năm
     * Khắc Tiềm - 15.09.2022
     */
    const elementSelectYear: any = ref(null);
    /**
     * Trạng thái show calendar
     * Khắc Tiềm - 15.09.2022
     */
    const showCalendar = ref(false);
    /**
     * Trạng thái show năm
     * Khắc Tiềm - 15.09.2022
     */
    const showSelectYear = ref(false);
    /**
     * Trạng thái show tháng
     * Khắc Tiềm - 15.09.2022
     */
    const showSelectMonth = ref(false);
    /**
     * Biến lưu ngày hiện tại
     * Khắc Tiềm - 15.09.2022
     */
    const dateNow = ref(new Date());
    /**
     * Model value truyền từ props
     * Khắc Tiềm - 15.09.2022
     */
    const { modelValue, disabled }: any = toRefs(props);

    /**
     * Biến lưu ngày được chọn
     * Khắc Tiềm - 15.09.2022
     */
    const currentDate = computed(() =>
      modelValue.value ? new Date(modelValue.value).getDate() : null
    );
    /**
     * Biến lưu tháng được chọn
     * Khắc Tiềm - 15.09.2022
     */
    const currentMonth = ref(
      modelValue.value
        ? new Date(modelValue.value).getMonth()
        : new Date().getMonth()
    );
    /**
     * Biến lưu năm được chọn
     * Khắc Tiềm - 15.09.2022
     */
    const currentYear = ref(
      modelValue.value
        ? new Date(modelValue.value).getFullYear()
        : new Date().getFullYear()
    );

    /**
     * Kiểm tra nếu có sự thay đổi của model value thì render lại giao diện
     * Khắc Tiềm - 15.09.2022
     */
    watch(modelValue, (newValue: any) => {
      currentMonth.value = newValue
        ? new Date(newValue).getMonth()
        : new Date().getMonth();
      currentYear.value = newValue
        ? new Date(newValue).getFullYear()
        : new Date().getFullYear();
    });

    /**
     * Tháng bắt đầu render
     * Khắc Tiềm - 15.09.2022
     */
    const daysInMonth = computed(() =>
      new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
    );
    /**
     * Ngày bắt đầu render
     * Khắc Tiềm - 15.09.2022
     */
    const startDay = computed(() =>
      new Date(currentYear.value, currentMonth.value, 0).getDay()
    );

    /**
     * Style posion
     */
    const style = ref({
      top: "",
      left: "",
    });

    /**
     * Hàm xử lý quay lại tháng
     * Khắc Tiềm - 15.09.2022
     */
    function handlePrevMonth() {
      if (currentMonth.value == 0) {
        currentMonth.value = 11;
        currentYear.value--;
      } else {
        currentMonth.value--;
      }
    }
    /**
     * Hàm xử lý next tháng
     * Khắc Tiềm - 15.09.2022
     */
    function handleNextMonth() {
      if (currentMonth.value === 11) {
        currentMonth.value = 0;
        currentYear.value++;
      } else {
        currentMonth.value++;
      }
    }
    /**
     * Hàm xử lý chọn năm
     * Khắc Tiềm - 15.09.2022
     */
    function handleSelectYear(year: any) {
      currentYear.value = year;
      showSelectYear.value = false;
      showSelectMonth.value = true;
    }
    /**
     * Hàm xử lý chọn tháng
     * Khắc Tiềm - 15.09.2022
     */
    function handleSelectMonth(month: any) {
      currentMonth.value = month - 1;
      showSelectMonth.value = false;
    }
    /**
     * Hàm xử lý chọn ngày
     * Khắc Tiềm - 15.09.2022
     */
    function handleSelectDate(dateSelect: any) {
      const me: any = proxy;
      let d;
      if (dateSelect === true) {
        d = new Date();
      } else {
        d = new Date(currentYear.value, currentMonth.value, dateSelect);
      }
      if (me.format == "DD/MM/YYYY") {
        if (d instanceof Date) {
          d.setHours(0);
          d.setMinutes(0);
          d.setSeconds(0);
        }
      }
      let pass = true;
      if (me.max && d > me.max) {
        pass = false;
      }
      if (me.min && d < me.min) {
        pass = false;
      }
      if (pass) {
        me.updateVModel(d);
        me.$refs.input.focus();
      }
      handleShowCalendar();
    }
    /**
     * Hàm xử lý ẩn calendar khi click ra ngoài calendar
     * Khắc Tiềm - 15.09.2022
     */
    const handleClickTemplate = (event: any) => {
      const isClickElementCalendar = elementCalendar.value.contains(
        event.target
      );
      const isClickElementIcon = elementIcon.value.contains(event.target);
      const isClickElementSelectMonth = elementSelectMonth.value.contains(
        event.target
      );
      const isClickElementSelectYear = elementSelectYear.value.contains(
        event.target
      );
      if (
        !isClickElementCalendar &&
        !isClickElementIcon &&
        !isClickElementSelectMonth &&
        !isClickElementSelectYear
      ) {
        handleShowCalendar();
      }
    };
    /**
     * Khi Unmounted thì sẽ xoá bỏ sự kiện xử lý ẩn calendar khi click ra ngoài calendar
     * Khắc Tiềm - 15.09.2022
     */
    onUnmounted(() => {
      window.removeEventListener("click", handleClickTemplate);
    });
    /**
     * Hàm xử lý ẩn hiện calendar
     * Khắc Tiềm - 15.09.2022
     */
    function handleShowCalendar() {
      if (!disabled.value) {
        if (showCalendar.value) {
          showSelectYear.value = false;
          showSelectMonth.value = false;
          window.removeEventListener("click", handleClickTemplate);
        } else {
          window.addEventListener("click", handleClickTemplate);
        }
        showCalendar.value = !showCalendar.value;
        handleCalcPosion();
      }
    }

    /**
     * Tính toán posion
     */
    const handleCalcPosion = () => {
      const me: any = proxy;
      if(showCalendar.value){
        let position: any = componentUtil.getPosition(
          me.$refs["buttonContainer"],
          me.$refs["elementCalendar"],
          null
        );
        if((position.top + 380) > window.innerHeight) { // 380 là chiều height của elm
          position.top = position.top - 380 - 32; // 32 là chiều cao của ô input
        }
        style.value.top = position.top + "px";
        style.value.left = (position.left - 300) + "px";
      }
    };

    return {
      errorMessage,
      validate,
      style,
      isValidate,
      currentMonth,
      currentYear,
      daysInMonth,
      startDay,
      dateNow,
      currentDate,
      showSelectMonth,
      showSelectYear,
      elementCalendar,
      elementIcon,
      elementSelectMonth,
      elementSelectYear,
      showCalendar,
      handleNextMonth,
      handlePrevMonth,
      handleSelectYear,
      handleSelectMonth,
      handleSelectDate,
      handleShowCalendar,
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
