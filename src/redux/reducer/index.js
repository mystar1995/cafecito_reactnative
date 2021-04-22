import {combineReducers} from 'redux'
import {persistStore} from 'redux-persist'
import {AsyncStorage} from 'react-native'

import auth from './auth'
import podcast from './podcast'
import product from './product'
import video from './video'
import influencers from './influencer'
import livestreams from './livestream'
import videocall from './videocall'
import audiocall from './audio'
import error from './error'
import cart from './cart'

const rootReducer = combineReducers({
    auth:auth,
    podcast:podcast,
    video:video,
    product:product,
    influencers:influencers,
    livestreams:livestreams,
    videocall:videocall,
    audiocall:audiocall,
    error:error,
    cart:cart
})

export default rootReducer