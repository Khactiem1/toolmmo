// src/fontawesome.js
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Import các icon bạn cần
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faTrash, faToggleOn, faKey, faCopy, faEnvelope, faFilePen} from '@fortawesome/free-solid-svg-icons';

// Thêm icon vào thư viện
library.add(faCoffee, faUser);
library.add(faCopy, faTrash, faToggleOn, faKey,faEnvelope, faFilePen);

export default FontAwesomeIcon;