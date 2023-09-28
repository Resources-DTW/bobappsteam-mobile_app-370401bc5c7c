import { AppService, AppServiceForm } from '../';
import store from '../../store';
const apiUrl = 'https://api.bobapps.co/v1';
// const apiUrl = 'https://api.thebobapps.com/v1';

import { Platform } from 'react-native';
import context from 'src/utils/context';

const loginMerchantsCall = (payload) => {
  let params = {
    email: payload.email,
    password: payload.password,
  }
  const url = `${apiUrl}/merchants/login`;
  return AppService({ url, method: 'POST', params });
};

const configMerchantsCall = (payload) => {

  const url = `${apiUrl}/merchants/config`;
  return AppService({ url, method: 'GET', authToken: payload.token });
};


const getItemsCall = (payload) => {

  const url = payload.query ? `${apiUrl}/items?${payload.query}&limit=${payload.limit}` : `${apiUrl}/items?is_slider=1`;
  return AppService({ url, method: 'GET', authToken: payload.token });
};


const getCateogriesCall = (payload) => {

  const url = `${apiUrl}/categories?sort_field=sort&sort_type=asc&limit=50` + (payload.offer_only ? "&has_offer=true" : "");
  return AppService({ url, method: 'GET', authToken: payload.token });
};

const getItemsByCategoryCall = (payload) => {

  const url = payload.id === "all" ? `${apiUrl}/items?page=${payload.page}${payload.sub_cat && payload.sub_cat != "all" ? "&sub_category_id=" + payload.sub_cat : ""}${payload.offer_only ? '&offer_only=1' : ''}` : `${apiUrl}/items?category_id=${payload.id}${payload.offer_only ? "&offer_only=1" : ""}&page=${payload.page}${payload.sub_cat && payload.sub_cat != payload.id ? "&sub_category_id=" + payload.sub_cat : ""}&limit=${payload.limit ? payload.limit : 20}`;
  return AppService({ url, method: 'GET', authToken: payload.token });
};



const addToCartCall = async (payload) => {
  let params = {
    item_id: payload.item_id,
    quantity: payload.quantity,
    options: payload.options,
    note: payload.note || ""
  }

  var form = new FormData();
  form.append("item_id", payload.item_id);
  form.append("quantity", payload.quantity);
  form.append("options", payload.options ? JSON.stringify(payload.options) : null);
  form.append("note", payload.note || "");

  if (payload.image) {
    const { image } = payload;
    let data = null
    if (image) {
      if (!image?.path.startsWith("file://")) {
        image.path = "file://" + image?.path
      }
      data = {
        uri: image?.path,
        name: image?.filename + Math.ceil(Math.random() * 999990) + "iiii" || 'image' + '.JPG',
        type: image?.mime,
      }
    }
    form.append("image", data);

  }
  const url = `${apiUrl}/cart/add`;
  return AppServiceForm({ url, method: 'POST', form, authToken: payload.token });
};


const getCartCall = (payload) => {
  let params = {

  }
  const url = `${apiUrl}/cart`;
  // console.warn(payload.token)
  return AppService({ url, method: 'GET', authToken: payload.token });
};

const getCartDetailsCall = (payload) => {
  let params = {

  }

  const url = `${apiUrl}/orders/my-orders/${payload.order_id}`;
  return AppService({ url, method: 'GET', authToken: payload.token });
};


const removeFromCartCall = (payload) => {
  let params = {

  }

  const url = `${apiUrl}/cart/${payload.cart_id}/${payload.index}`;
  return AppService({ url, method: 'DELETE', authToken: payload.token });
};


const editCartItemCall = (payload) => {
  let params = {
    quantity: payload.quantity
  }

  const url = `${apiUrl}/cart/${payload.cart_id}/${payload.index}`;
  return AppService({ url, method: 'PUT', params, authToken: payload.token });
};


const getItemsSearchCall = (payload) => {

  const url = `${apiUrl}/items?${payload.search}&page=${payload.page}`;
  return AppService({ url, method: 'GET', authToken: payload.token });
};

const loginUserCall = (payload) => {
  let params = {
    phone: payload.phone,
    hash: payload.hash
  }
  const url = `${apiUrl}/system_users/login`;
  return AppService({ url, method: 'POST', params, authToken: payload.token });
};

const checkOtpCall = (payload) => {
  let params = {
    // phone: payload.phone,
  }
  const url = `${apiUrl}/system_users/otp_code/${payload.phone}/${payload.code}`;
  return AppService({ url, method: 'POST', authToken: payload.token });
};

const getAdressesCall = (payload) => {
  let params = {
    // phone: payload.phone,
  }
  const url = `${apiUrl}/addresses`;
  return AppService({ url, method: 'GET', authToken: payload.token });
};

const createAdressesCall = (payload) => {
  let params = {
    "name": payload.name,
    "state": payload.state,
    "city": payload.city,
    "area": payload.area,
    "street": payload.street,
    "lat": payload.lat,
    "long": payload.long,
    "building": payload.building
  }
  const url = `${apiUrl}/addresses`;
  return AppService({ url, method: 'POST', params, authToken: payload.token });
};

const getLocationNameCall = (payload) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${payload.latlng}&key=AIzaSyDHUWPfalHhfjfnxRcyd-PfIUN_sMhdxo4&language=${context.getCurrentLanguage()}`;
  return AppServiceForm({ url, method: 'GET', });
};

const getShippingFeesCall = (payload) => {
  const url = `${apiUrl}/shipping/${payload.cart_id}/${payload.address_id}${payload.future_date ? '?future_date=tomorrow' : ''}`;
  return AppService({ url, method: 'GET', authToken: payload.token });
};

const getTaxCall = (payload) => {
  const url = `${apiUrl}/tax/${payload.cart_id}/${payload.address_id}`;
  return AppService({ url, method: 'GET', authToken: payload.token });
};

const createOrderCall = (payload) => {
  const params = payload.coupon_id ? {
    coupon_id: payload.coupon_id,
    delivery_date: payload.delivery_date,
    check_out_note: payload.check_out_note,
    table_number: payload.table_number ? payload.table_number : '',
    resourcePath: payload.resourcePath ? payload.resourcePath : '',
    session_id: payload.session_id ? payload.session_id : '',
    channel_name: 'mob_delivery_orders'
  } : {
    delivery_date: payload.delivery_date,
    check_out_note: payload.check_out_note,
    table_number: payload.table_number ? payload.table_number : '',
    resourcePath: payload.resourcePath ? payload.resourcePath : '',
    session_id: payload.session_id ? payload.session_id : '',
    channel_name: 'mob_delivery_orders'

  };

  const url = `${apiUrl}/orders/${payload.cart_id}/${payload.address_id != "" ? payload.address_id : "indoor"}`;
  return AppService({ url, method: 'POST', params, authToken: payload.token });
};

const getOrdersCall = (payload) => {
  const url = `${apiUrl}/orders/my-orders`;
  return AppService({ url, method: 'GET', authToken: payload.token });
};

const completeRegistrationCall = (payload) => {
  const url = `${apiUrl}/system_users/settings`;
  let params = {
    "full_name": payload.full_name,
    "gender": payload.gender,
    "birth_date": payload.birth_date,
    "email": payload.email,
  }
  let filterParams = {}
  Object.keys(params).keys(key => {
    if (params[key]) {
      filterParams[key] = params[key]
    }
  })
  return AppService({ url, params: filterParams, method: 'POST', authToken: payload.token });
};

const subscribeToNotificationsCall = (payload) => {
  const url = `${apiUrl}/notifications/token`;
  let params = {
    "registration_token": payload.registration_token,
  }
  return AppService({ url, params, method: 'POST', authToken: payload.token });
};



const getNotificationCall = (payload) => {
  let params = {

  }

  const url = `${apiUrl}/notifications`;
  return AppService({ url, method: 'GET', authToken: payload.token });
};


const getUserDataCall = (payload) => {
  let params = {
  }
  const url = `${apiUrl}/system_users/config`;
  return AppService({ url, method: 'GET', authToken: payload.token });
};


const addToFavCall = (payload) => {
  let params = {
    "reference_id": payload.id,
    "reference_type": ""
  }
  const url = `${apiUrl}/favorites`;
  return AppService({ url, params, method: 'POST', authToken: payload.token });
};

const getAllFavCall = (payload) => {

  const url = `${apiUrl}/favorites`;
  return AppService({ url, method: 'GET', authToken: payload.token });
};



const removeFavCall = (payload) => {
  let params = {
    "reference_id": payload.id,
    "reference_type": ""
  }
  const url = `${apiUrl}/favorites/${payload.id}`;
  return AppService({ url, method: 'DELETE', authToken: payload.token });
};

const editAdressesCall = (payload) => {
  let params = {
    "name": payload.name,
    "state": payload.state,
    "city": payload.city,
    "area": payload.area,
    "street": payload.street,
    "lat": payload.lat,
    "long": payload.long,
    "building": payload.building
  }
  const url = `${apiUrl}/addresses/${payload.id}`;
  return AppService({ url, method: 'PUT', params, authToken: payload.token });
};

const deleteAdressesCall = (payload) => {
  let params = {
    "name": payload.name,
    "state": payload.state,
    "city": payload.city,
    "area": payload.area,
    "street": payload.street,
    "lat": payload.lat,
    "long": payload.long,
    "building": payload.building
  }
  const url = `${apiUrl}/addresses/${payload.id}`;
  return AppService({ url, method: 'DELETE', authToken: payload.token });
};


const couponCall = (payload) => {
  let params = {
    "code": payload.code,
  }
  const url = `${apiUrl}/coupons/validate`;
  return AppService({ url, method: 'POST', params, authToken: payload.token });
};

const updateInfoCall = (payload) => {
  const url = `${apiUrl}/system_users/settings`;
  var form = new FormData();
  form.append("full_name", payload.full_name);
  form.append("gender", payload.gender);
  form.append("birth_date", payload.birth_date);
  form.append("email", payload.email);
  form.append("phone", payload.phone);
  form.append("avatar", payload.avatar);

  return AppServiceForm({ url, form, method: 'PUT', authToken: payload.token });
};

const merchantsLoginCall = (payload) => {
  const url = `${apiUrl}/merchants/login`;
  let params = {
    "email": payload.email,
    "password": payload.password,
  }
  return AppService({ url, params, method: 'POST', authToken: payload.token });
};


const getSubCatsCall = (payload) => {
  const url = `${apiUrl}/categories/sub_categories?page=${payload.page}` + (payload.cat_id && payload.cat_id != 'all' ? `&parent_id=${payload.cat_id}` : '') + (payload.offer_only ? "&has_offer=true" : "");
  return AppService({ url, method: 'GET', authToken: payload.token });
};


const getSlidesCall = (payload) => {

  const url = `${apiUrl}/slides`;
  return AppService({ url, method: 'GET', authToken: payload.token });
};

const markAllAsReadCall = (payload) => {
  const url = `${apiUrl}/notifications/mark_as_read`;
  let params = {
    all: true
  }
  return AppService({ url, params, method: 'PUT', authToken: payload.token });
};

const rateItemCall = (payload) => {
  const url = `${apiUrl}/ratings/items/${payload.id}`;
  let params = {
    comment: payload.comment,
    rate_value: payload.rate_value
  }
  return AppService({ url, params, method: 'POST', authToken: payload.token });
};
// https://api.thebobapps.com/v1/ratings/<items or orders>/<ITEM_ID or ORDER_ID>

const getItemRatesCall = (payload) => {
  const url = `${apiUrl}/ratings/items/${payload.id}`;
  let params = {
    comment: payload.comment,
    rate_value: payload.rate_value
  }
  return AppService({ url, method: 'GET', authToken: payload.token });
};

const createOnlineOrderCall = (payload) => {
  const params = payload.coupon_id ? {
    coupon_id: payload.coupon_id,
    delivery_date: payload.delivery_date,
    check_out_note: payload.check_out_note,
    table_number: payload.table_number ? payload.table_number : ''
  } : {
    delivery_date: payload.delivery_date,
    check_out_note: payload.check_out_note,
    table_number: payload.table_number ? payload.table_number : ''
  };

  const url = `${apiUrl}/orders/checkout?total_amount=${payload.total_amount}&address_id=${payload.address_id}`;
  return AppService({ url, method: 'GET', authToken: payload.token });
};


const startPaymentSessionCall = (payload) => {

  // var form = new FormData();
  // // const url = `${apiUrl}/system_users/settings`;
  // Object.keys(payload).map(key => {
  //   form.append(key, payload[key]);
  // })

  const url = `${apiUrl}/orders/checkout_meps`;
  return AppService({ url, method: 'GET', authToken: payload.token });
};

const getItemDetailsCall = (payload) => {
  const url = `${apiUrl}/items/${payload.id}`;

  return AppService({ url, method: 'GET', authToken: payload.token });
};
const createEmptyCartCall = (payload) => {
  const url = `${apiUrl}/cart/create_empty`;

  return AppService({ url, method: 'POST', authToken: payload.token });
};

const aboutMerchantCall = (payload) => {
  const url = `${apiUrl}/merchants/main_info/${payload._id}`;

  return AppService({ url, method: 'GET', authToken: payload.token });
};

const merchantsMainInfoCall = (payload) => {
  const url = `${apiUrl}/merchants/main_info/${payload._id}`;
  let params = {
    "email": payload.email,
    "password": payload.password,
  }
  return AppService({ url, method: 'GET', authToken: payload.token });
};
export {
  loginMerchantsCall,
  getItemsCall,
  getCateogriesCall,
  getItemsByCategoryCall,
  addToCartCall,
  configMerchantsCall,
  getCartCall,
  removeFromCartCall,
  getItemsSearchCall,
  loginUserCall,
  checkOtpCall,
  getAdressesCall,
  createAdressesCall,
  getLocationNameCall,
  getShippingFeesCall,
  getTaxCall,
  createOrderCall,
  getOrdersCall,
  completeRegistrationCall,
  subscribeToNotificationsCall,
  getCartDetailsCall,
  getNotificationCall,
  getUserDataCall,
  addToFavCall,
  getAllFavCall,
  removeFavCall,
  editAdressesCall,
  deleteAdressesCall,
  couponCall,
  updateInfoCall,
  merchantsLoginCall,
  getSubCatsCall,
  getSlidesCall,
  markAllAsReadCall,
  rateItemCall,
  getItemRatesCall,
  editCartItemCall,
  createOnlineOrderCall,
  startPaymentSessionCall,
  getItemDetailsCall,
  createEmptyCartCall,
  aboutMerchantCall,
  merchantsMainInfoCall,
};