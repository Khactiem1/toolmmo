export const useRemoteCombobox = () => {
	const comboboxLoadData = (payload, entityApi, data, name, callBackFn = null) => {
		if (payload && entityApi) {
			entityApi.getComboboxPaging(payload).then((result) => {
				if (typeof callBackFn == 'function') {
					// bổ sung func cho phép dev custom dữ liệu combo
					result = callBackFn(result);
					data[name] = result;
				}
				if (result && result.Data?.PageData) {
					data[name] = result.Data.PageData;
				}
			});
		}
	};

	return { comboboxLoadData };
};
