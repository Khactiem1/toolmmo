import i18nGlobal from '@/i18n/i18n';
import { MSConstant } from '@/commons/wildcards';
import moment from 'moment';
import DOMPurify from 'dompurify';
import { FormatType } from './wildcards/constants';
import { msFormat } from './msFormat';
import { showError } from '@/commons/globalMessage';
const i18n = i18nGlobal.global;

/**
 * Class chứa các function dùng chung cho hệ thống phía client
 */
class CommonFunction {/**
  * Xử lý dữ liệu trả về từ server
  */
  processServerResponseData(data: any) {
    if (data) {
      const rgDate = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d/;
      const rgDateTime = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(.)?(\d{0,9})?(Z)?(\+)?(\d{2})?(:)?(\d{2})?$/;
      for (let i in data) {
        if (data[i]) {
          if (typeof data[i] === 'string' && (rgDate.test(data[i]) || rgDateTime.test(data[i]))) {
            let dateValue = new Date(data[i]);
            //kdlong 13.06.2023 case trường hợp không parse được
            //kdlong 6.9.2023 fixbug 35844 so sánh tương đối thôi vì invalid date không phải string để ss tuyệt đối được
            if (dateValue instanceof Date && !isNaN(dateValue.valueOf())) {
              data[i] = dateValue;
            }
          } else if (typeof data[i] === 'object' && Object.keys(data[i].length > 0)) {
            this.processServerResponseData(data[i]);
          }
        }
      }
    }
  }
  mask() {
    let el: any = document.body.querySelector('#mloading');
    if (el) {
      el.style.display = 'flex';
    }
  }
  unmask() {
    let el: any = document.body.querySelector('#mloading');
    if (el) {
      el.style.display = 'none';
    }
  }

	downloadLink(link) {
		let a: any = document.getElementById('adownload');
		a.href = link;
		a.click();
	}
	
	/**
	 * xử lý string trước khi render để chống xss
	 */
	processXssValue(value: any) {
		if (typeof value === 'string') {
			// return escape(value);
			return DOMPurify.sanitize(value);
		}
		return value;
	}

	/**
	 * xử lý string trước khi render để chống xss
	 * cho phép blank thẻ a
	 */
	processXssValueAllowTargetBlank(value: any) {
		if (typeof value === 'string') {
			return DOMPurify.sanitize(value, {
				ADD_ATTR: ['target'],
			});
		}
		return value;
	}

  /**
   * Đăng xuất chuyển về màn hình đăng nhập AMIS và xóa các tài nguyên lưu ở dưới client
   */
  logout() {
    localStorage.clear();
    sessionStorage.clear();
		window.location.reload();
  }

	/**
	 * Lấy ra user đang đăng nhập
	 */
	getUser(){
		const user = localStorage.getItem('user');
		if(user){
			return JSON.parse(user);
		}
	}

	/**
	 * Xử lý lỗi ValidateResult từ BE
	 */
	handleErrorValidateResult(validateResults: any []){
		if(validateResults?.length){
			const message: string [] = [];
			validateResults.forEach((rule: any) => {
				if(rule.ErrorMessage){
					message.push(i18n.t(rule.ErrorMessage));
				}
			});
			if(message.length){
				showError(message.join("; "));
			}
		}
	}

	/**
	 * Lưu user vào local store
	 */
	setUser(user: any){
		localStorage.setItem('user', JSON.stringify(user));
	}

  /**
	 * Lấy giá trị enum theo text
	 */
	getEnumValue(enumName: any, text: any) {
		let source = this.getEnumSource(enumName);
		let textTrim = text;
		if(typeof text.trim === 'function'){
			textTrim = text.trim();
		}
		for (let i = 0; i < source.length; i++) {
			let item = source[i];
			if (textTrim === item.enumText) {
				return item.enumValue;
			}
		}

		return null;
	}

	/**
	 * Tự động focus vào control nhập liệu đầu tiên theo scope truyền vào
	 * @param {Element} scope Phạm vi cần xử lý focus
	 */
	focusFirstControl(scope: any) {
		if (scope) {
			const me = this;
			let input;
			if (scope.type === 'text' || (scope.hasAttribute && scope.hasAttribute('type'))) {
				input = scope;
			} else {
				input = me.findFirstControlFocus(scope);
			}

			if (input && typeof input.focus === 'function') {
				input.focus();
			}
		}
	}

		/**
		 *  Tạo uuid
		 */
		generateUUID() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
				let d = new Date().getTime();
				d += performance.now();
				let r = (d + Math.random() * 16) % 16 | 0;
				d = Math.floor(d / 16);
				return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
			});
		}
		/**
		 * Guild empty
		 */
		generateEmptyUUID() {
			return '00000000-0000-0000-0000-000000000000';
		}

	/**
	 * Tìm ra control Input đầu tiên theo scope truyền vào và cho phép sửa
	 * @param {Element} scope Parent cần tìm input
	 * @author bnduc - 15.11.2019
	 */
	findFirstControlFocus(scope: any) {
		if (scope && scope.querySelector) {
			let input = scope.querySelector('input:not([readonly]):not([disabled]),button:not([disable]),a,textarea');
			return input;
		}
		return;
	}

	/**
	 * Lấy ra giá trị key của enum theo value
	 * @param {Number} value Giá trị của enum cần lấy ra enum text
	 * @param {String} enumName EnumName để get text
	 */
	getEnumText(value: any, enumName: any) {
		let e = MSConstant[enumName];

		if (e) {
			for (const key in e) {
				if (e.hasOwnProperty(key) && e[key] === value) {
					return key;
				}
			}
		}

		return value;
	}

	/**
	 * Lấy ra resource theo enum
	 * @param {Number} value Giá trị của enum cần lấy ra enum resource
	 * @param {String} enumName EnumName để get text
	 */
	getEnumResource(value: any, enumName: any) {
		const me = this,
			localize = i18n;

		let key = me.getEnumText(value, enumName);
		let resourceKey = enumName + '.' + key;
		let text = localize.t('i18nEnum.' + resourceKey);
		return text;
	}

	/**
	 * Lấy enumsource với tên enum truyền vào
	 * @param {String} enumName Tên enum trong enumeration
	 * @param {Array} values Danh sách các enum lấy ra (nếu cần chỉ định), nếu không thì sẽ lấy tất cả
	 * @param {Boolean} prefixIdx Có kèm theo tiền tố index không: true - có, false - không (Mặc định không)
	 * VD: getEnumSource("EnumCABAReasonType",[10,11,12,13])
	 */
	getEnumSource(enumName: any, values: any = null, prefixIdx = false) {
		let e = MSConstant[enumName],
			arr = [];
		if (e) {
			let idx = 0;
			for (const key in e) {
				if (e.hasOwnProperty(key)) {
					let v = e[key],
						ix = -1;
					if (!values || (ix = values.indexOf(v)) > -1) {
						/*
						 * sửa lại cách lấy dữ liệu theo enum
						 * pvduy 02/02/2020
						 */
						let enumText = i18n.t('i18nEnum.' + enumName + '.' + key);
						if (prefixIdx) {
							enumText = ++idx + '. ' + enumText;
						}

						let item = {
							enumValue: v,
							enumKey: key,
							enumText: enumText,
						};

						if (ix > -1) {
							// DVQUAN: sửa lại cách lấy enum source với trường hợp 9 và 99 => không lấy được 1 trong 2
							if (arr[ix]) {
								arr[arr.length] = item;
							} else {
								arr[ix] = item;
							}
						} else {
							arr.push(item);
						}
					}
				}
			}
		}
		return arr;
	}

	/**
	 * Xử lý nối 2 filter lại với nhau với param tham số paging đã stringify
	 */
	concatFilter(param: any, filterConcat: any []){
		if(filterConcat?.length){
			let filter: any [] = [];
			if(param.Filter && typeof param.Filter === 'string'){
				filter = [JSON.parse(param.Filter)];
			}
			if(filter?.length){
				filter.push("and");
			}
			filter.push(filterConcat);
			if(filter?.length){
				param.Filter = JSON.stringify(filter);
			}
		}
	}

	buildFilterParam(filters: any) {
		let me = this,
			sFilter = '';

		if (filters && !(filters instanceof Array)) {
			filters = [filters];
		}

		let length = filters.length;

		if (length > 0) {
			let i,
				arrayFilters: any = [],
				sJoin = ',';

			for (i = 0; i < length; i++) {
				let filter = filters[i],
					sChildFilter = '',
					operandChild = 'and';

				if (filter.childrens instanceof Array && filter.childrens.length > 0) {
					let childFirst = filter.childrens[0];
					if (childFirst.operand) {
						operandChild = childFirst.operand;
					}

					sChildFilter = me.buildFilterParam(filter.childrens);
				}

				let s = '"' + filter.property + '",' + (filter.operator ? '"' + filter.operator + '",' : ''),
					//Mặc định operand là `and`
					operand = '"and"';

				s += me.nomalizeFilterValue(filter.operator, filter.value);
				//xử lý tình huống muôn filter = 0/false nhưng muốn lọc ra cả các giá trị null
				if (filter.nullToFail && (filter.value === 0 || filter.value === false)) {
					s += ',true';
				}

				s = '[' + s + ']';

				if (sChildFilter) {
					s = '[' + s + ',"' + operandChild + '",' + sChildFilter + ']';
				}

				if (i !== 0) {
					if (filter.operand) {
						operand = '"' + filter.operand + '"';
					}
					arrayFilters.add(operand);
				}
				arrayFilters.add(s);
			}

			sFilter = arrayFilters.join(sJoin);
			if (length > 1) {
				sFilter = '[' + sFilter + ']';
			}
		}

		return sFilter;
	}

	nomalizeFilterValue(operator: any, value: any) {
		let ret: any = '';
		switch (operator) {
			case 'in':
			case 'notin':
				ret = JSON.stringify(value);
				break;
			default:
				if (typeof value === 'number') {
					ret = value.toString();
				} else if (typeof value === 'boolean') {
					ret = value;
				} else if (value instanceof Date) {
					if (value.getHours() === 0 && value.getMinutes() === 0 && value.getSeconds() === 0) {
						ret = ['"', moment(value).format('YYYY-MM-DD'), 'T00:00:00"'].join('');
					} else {
						ret = ['"', moment(value).format('YYYY-MM-DDThh:mm:ss'), '"'].join('');
					}
				} else {
					ret = ['"', value, '"'].join('');
				}
		}

		return ret;
	}

	/**
	 * Xử lý tham số trước khi gọi lên server load dữ liệu cho combobox
	 */
	processComboboxParamRequest(param: any) {
		const me = this;
		for (let i in param) {
			let value = param[i];
			switch (i) {
				case 'filter':
					//chuẩn hóa tham số filter
					if (Array.isArray(value) && value.length > 0) {
						value = me.buildFilterParam(value);
					} else {
						continue;
					}
					break;
			}
			param[i] = value;
		}
	}

	/**
	 * Thêm thông báo
	 */
	pushNotification(noti: any){
		const elmTopMessage: any = document.getElementById('notifications-list-id-app');
		if(elmTopMessage && typeof elmTopMessage.getVueInstance === 'function'){
			const me = elmTopMessage.getVueInstance();
			me.notifications.push(
				{ type: noti.type, message: noti.message, id: (Math.random().toString(36) + Date.now().toString(36)).substr(2) }
			);
		}
	}

	/**
	 * Xử lý dữ liệu bind theo đúng định dạng trên grid
	 */
	processDataaGridViewer(col: any, data: any){
		if(!col || (col && !col.formatType)) return data;
		switch (col.formatType) {
			case FormatType.Text:
				return data;
			case FormatType.Date:
			case FormatType.List:
				if(data){
					return moment(data).format('DD/MM/YYYY');
				}
				return data;
			case FormatType.DateTime:
				if(data){
					return moment(data).format('DD/MM/YYYY HH:mm:ss');
				}
				return data;
			case FormatType.Enum:
				return msFormat.formatEnum(data, col.enum);
			case FormatType.Number:
				return msFormat.formatNumber(data);
			default:
				break;
		}
	}

	/**
	 * Thực hiện sắp xếp cây để bind lên grid
	 */
	sortMenuAndAddLevel(
		menuList: any[],
		parentField: string,
		idField: string,
		sortField: string
	): any[] {
		const menuMap = new Map<string | null, any[]>();
	
		// Tạo bản đồ nhóm các phần tử theo parentField
		menuList.forEach((menu) => {
			const parentId = menu[parentField];
			if (!menuMap.has(parentId)) {
				menuMap.set(parentId, []);
			}
			menuMap.get(parentId)!.push(menu);
		});
	
		// Xác định is_parent cho từng bản ghi
		menuList.forEach((menu) => {
			menu.is_parent = menuMap.has(menu[idField]);
			if (menu.is_parent && !menu.hasOwnProperty('expand')) {
				menu.expand = true;
			}
		});
	
		// Xác định các bản ghi có parent_id không tồn tại trong danh sách menu
		const orphanRecords: any[] = [];
		menuList.forEach((menu) => {
			const parentId = menu[parentField];
			if (parentId && !menuList.some((item) => item[idField] === parentId)) {
				orphanRecords.push(menu);
				menu[parentField] = null; // Coi như không có cha
			}
		});
	
		// Thêm các bản ghi không có cha vào nhóm parent_id = null
		orphanRecords.forEach((orphan) => {
			if (!menuMap.has(null)) {
				menuMap.set(null, []);
			}
			menuMap.get(null)!.push(orphan);
		});
	
		// Hàm đệ quy thu thập và thêm cấp độ
		const collectSortedItems = (parentId: string | null, level: number): any[] => {
			const children = menuMap.get(parentId) || [];
			// Sắp xếp các phần tử theo sortField
			children.sort((a, b) => a[sortField] - b[sortField]);
	
			// Thêm cấp độ và thu thập con, cháu...
			return children.flatMap((child) => {
				child.level = level; // Gán cấp độ hiện tại
				return [child, ...collectSortedItems(child[idField], level + 1)];
			});
		};
	
		// Bắt đầu thu thập từ các phần tử gốc (parentField = null) với level = 1
		return collectSortedItems(null, 1);
	}

	/**
	 * Update toàn bộ giá trị cho con 
	 */
	updateChildrenIsHide(
		isHide: boolean,
		menuList: any[],
		parentField: string,
		idField: string,
		parentId: any
	): void {
		const updateChildren = (currentParentId: any) => {
			menuList.forEach((item) => {
				if (item[parentField] === currentParentId) {
					item.is_hide = isHide; // Cập nhật giá trị is_hide
					if(!isHide && item.hasOwnProperty('expand')){
						item.expand = true;
					}
					updateChildren(item[idField]); // Đệ quy để xử lý các cấp con
				}
			});
		};
	
		updateChildren(parentId); // Bắt đầu từ cha truyền vào
	}

	/**
	 * Xoá toàn bộ cha con, cháu chắt của 1 mảng tree với id cha truyền vào
	 */
	deleteHierarchyTree(
		menuList: any[], // Mảng dữ liệu
		parentField: string, // Tên field cha
		idField: string, // Tên field con
		parentId: string | null // ID cha cần xóa
	): any[] {
		// Hàm đệ quy để thu thập tất cả các ID cần xóa
		const collectIdsToDelete = (id: string | null, list: any[]): Set<string> => {
			const idsToDelete = new Set<string>();
	
			// Duyệt qua tất cả các phần tử để tìm các con trực tiếp
			const stack = [id];
			while (stack.length > 0) {
				const currentId = stack.pop();
				if (!currentId) continue;
				idsToDelete.add(currentId);
	
				// Tìm các con của currentId
				list.forEach((item) => {
					if (item[parentField] === currentId) {
						stack.push(item[idField]);
					}
				});
			}
	
			return idsToDelete;
		};
	
		// Thu thập tất cả các ID cần xóa
		const idsToDelete = collectIdsToDelete(parentId, menuList);
	
		// Lọc lại menuList để loại bỏ các phần tử có ID nằm trong idsToDelete
		return menuList.filter((item) => !idsToDelete.has(item[idField]));
	}

	shortkeyPushView(el) {
		if (!window.shortkeyView) {
			window.shortkeyView = [];
		}
		window.shortkeyView.remove(el);
		window.shortkeyView.push(el);
	}

	shortkeyPopView(el) {
		window.shortkeyView.remove(el);
	}

	/**
	 * Kiểm tra đối tượng có class style không
	 */
	hasClass(element, className) {
		if (element && element.className) {
			return element.className.indexOf(className) > -1;
		}
		return false;
	}

	/**
	 * Kiểm tra 2 đối tượng có phải là cha con của nhau không
	 */
	hasParent(child, parent) {
		if (child.parentElement) {
			if (child.parentElement === parent) {
				return true;
			} else {
				return this.hasParent(child.parentElement, parent);
			}
		}

		return false;
	}

	/**
	 * Build vue key cho data
	 */
	genVKeyValue(data, field = '__vKeyValue') {
		if (data) {
			data.forEach((item) => {
				item[field] = this.generateUUID();
			});
		}
	}

	/**
	 * Thực hiện ghép các node cha đi kèm với các node con luôn để thực hiện show ra ngay bên dưới node cha
	 * @param {[TreeModel]} dataResoures Danh sách các node cha cần sắp xếp
	 * @param {*} expanded Có Mở rộng ra không
	 * @param {*} level
	 */
	getBodyData(dataResoures, expanded, level = 1, childNodes = 'childNodes', isGroup = false) {
		if (!dataResoures) {
			return [];
		}
		let data = [...dataResoures];
		let bodyData = [];
		for (let i = 0; i < data.length; i++) {
			const row = data[i];
			const children = row[childNodes];
			const childrenLen = Object.prototype.toString.call(children).slice(8, -1) === 'Array' ? children.length : 0;
			row.level = level;
			row.isSelected = false;
			row._isSelectedMultiple = false;
			if (isGroup && row.caption) {
				row.caption += ` (${childrenLen})`;
			}
			bodyData.push(row);
			if (childrenLen > 0) {
				row._expandable = true;
				bodyData = bodyData.concat(this.getBodyData(children, expanded, level + 1, childNodes, isGroup));
			}
		}
		return bodyData;
	}
}
export default new CommonFunction();