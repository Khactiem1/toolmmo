import { type App } from "vue";
import MsDynamicPopup from '@/components/popup/MsDynamicPopup.vue';
import MsDatepicker from '@/components/datepicker/MsDatepicker.vue';
import MsInput from '@/components/input/MsInput.vue';
import MsTextarea from '@/components/input/MsTextarea.vue';
import MsNumber from '@/components/input/MsNumber.vue';
import MsCheckbox from '@/components/checkbox/MsCheckbox.vue';
import MsRadio from '@/components/radio/MsRadio.vue';
import MsButton from '@/components/button/MsButton.vue';
import MsCombobox from '@/components/combobox/MsCombobox.vue';
import FontAwesomeIcon from '@/commons/fontawesome';
import MsSwitch from '@/components/switch/MsSwitch.vue';
import MsComboboxV2 from '@/components/comboboxV2/MsComboboxV2.vue';
import MsComboboxEnum from '@/components/comboboxV2/MsComboboxEnum.vue';

export const globalComponents = (app: App<Element>) => {
  app.component('MsDynamicPopup', MsDynamicPopup);
  app.component('MsDatepicker', MsDatepicker);
  app.component('MsInput', MsInput);
  app.component('MsTextarea', MsTextarea);
  app.component('MsNumber', MsNumber);
  app.component('MsCheckbox', MsCheckbox);
  app.component('MsRadio', MsRadio);
  app.component('MsButton', MsButton);
  app.component('MsCombobox', MsCombobox);
  app.component('font-awesome-icon', FontAwesomeIcon);
  app.component('MsSwitch', MsSwitch);
  app.component('MsComboboxV2', MsComboboxV2);
  app.component('MsComboboxEnum', MsComboboxEnum);
}