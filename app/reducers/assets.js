import update from 'immutability-helper'
import {
  REQUEST_ASSETS,
  RECEIVE_ASSETS,
  NEW_ASSET,
  UPDATE_ASSET,
  DELETE_ASSET
} from 'actions/assetActions'

export default function assets (state = {}, action) {
  switch (action.type) {
    case REQUEST_ASSETS: {
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      }
    }

    case RECEIVE_ASSETS: {
      return {
        ...state,
        assets: action.assets,
        isFetching: false,
        didInvalidate: false,
        lastUpdated: action.receivedAt
      }
    }

    case NEW_ASSET: {
      return {
        ...state,
        assets: [
          ...state.assets,
          action.addAsset
        ]
      }
    }

    case UPDATE_ASSET: {
      const assetIndex = state.assets.findIndex(asset => asset._id === action._id)
      if (assetIndex === -1) return state

      return {
        ...state,
        assets: [
          ...state.assets.slice(0, assetIndex),
          update(state.assets[assetIndex], { $merge: action.updatedAsset }),
          ...state.assets.slice(assetIndex + 1)
        ]
      }
    }

    case DELETE_ASSET: {
      const assetIndex = state.assets.findIndex(asset => asset._id === action.id)
      if (assetIndex === -1) return state

      return {
        ...state,
        assets: [
          ...state.assets.slice(0, assetIndex),
          ...state.assets.slice(assetIndex + 1)
        ]
      }
    }

    default:
      return state
  }
}
