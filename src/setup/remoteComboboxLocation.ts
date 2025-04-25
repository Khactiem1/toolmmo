export const useRemoteComboboxLocation = () => {
	const comboboxLoadDataLocation = async (
            payload, 
            model, 
            data, 
            name, 
            fieldSearchInModel = { address: 'address', ward_name: 'ward_name', district_name: 'district_name', province_name: 'province_name' },
            callBackFn = null
        ) => {
        if(typeof window._goongConfig?.urlSearchLocation === 'function'){
            const textSearch = `${model[fieldSearchInModel.address]} ${model[fieldSearchInModel.ward_name]} ${model[fieldSearchInModel.district_name]} ${model[fieldSearchInModel.province_name]}`;
            const url = window._goongConfig.urlSearchLocation(textSearch);
            const response = await fetch(url);
            let result: any = await response.json();
            if(typeof callBackFn === 'function'){
                result = callBackFn(result);
            }
            if(result?.results?.length){
                data[name] = result.results;
                return;
            }
        }
        data[name] = [];
	};
	return { comboboxLoadDataLocation };
};
