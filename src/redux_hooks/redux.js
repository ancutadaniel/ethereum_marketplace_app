import * as ACTIONS from './constants';
const {
  SET_WEB3,
  SET_ERROR,
  SET_LOADING,
  SET_PRODUCT_NAME,
  SET_PRODUCT_PRICE,
  SET_FORM_LOADING,
  RESET_FORM,
  SET_PRODUCTS,
} = ACTIONS;

export const reducer = (state, action) => {
  // console.log('type: ', action.type, ' <===> value:', action.value);
  switch (action.type) {
    case SET_WEB3:
      const { web3, contract, account, loading } = action.value;
      return {
        ...state,
        contract,
        web3,
        account: account[0],
        loading,
      };

    case SET_ERROR:
      return {
        ...state,
        errors: action.value,
        formLoading: false,
      };

    case SET_LOADING: {
      return {
        ...state,
        loading: !state.loading,
      };
    }

    case SET_PRODUCTS:
      const [header] = action.value.map((item) => {
        let arr = [];
        arr = [...Object.keys(item), ''];
        return arr;
      });

      return {
        ...state,
        products: action.value,
        header,
        loading: false,
        loadProducts: false,
      };

    case SET_PRODUCT_NAME:
      return {
        ...state,
        productName: action.value,
      };

    case SET_PRODUCT_PRICE:
      return {
        ...state,
        productPrice: action.value,
      };

    case SET_FORM_LOADING: {
      return {
        ...state,
        formLoading: !state.formLoading,
      };
    }

    case RESET_FORM:
      return {
        ...state,
        productName: '',
        productPrice: '',
        formLoading: false,
        loadProducts: true,
      };

    default:
      return {
        ...state,
      };
  }
};
