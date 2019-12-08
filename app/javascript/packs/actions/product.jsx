import {
  LOAD_PRODUCTS,
  LOAD_PRODUCT,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  LOAD_VARIANT,
  LOAD_VARIANTS
} from '../helper/types'

export const loadProducts = (data) => ({
  type: LOAD_PRODUCTS,
  data: data
})

export const createProduct = (data) => ({
  type: CREATE_PRODUCT,
  data: data
})

export const loadProduct = (data) => ({
  type: LOAD_PRODUCT,
  data: data
})

export const updateProduct = (data) => ({
  type: UPDATE_PRODUCT,
  data: data
})

export const deleteProduct = (data) => ({
  type: DELETE_PRODUCT,
  data: data
})

export const loadVariant = data => ({
  type: LOAD_VARIANT,
  data: data
})

export const loadVariants = data => ({
  type: LOAD_VARIANTS,
  data: data
})
