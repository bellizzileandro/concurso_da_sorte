import React from 'react'
import { Provider } from 'react-redux'
import { Provider as PaperProvider } from 'react-native-paper'
import { enableScreens } from 'react-native-screens'
import 'react-native-gesture-handler'
import Geolocation from 'react-native-geolocation-service'

import { YellowBox, Alert, PermissionsAndroid, View, Text, Platform, ToastAndroid } from 'react-native'

import ConcursoApp from './src/views'

import store from './src/redux/store'

enableScreens()

if (__DEV__) {
  require('react-devtools');
}

/**
 * Desabilita o YellowBox no modo DEV.
 * Por segurança, foi desabilitado, para que não ocorra em produção.
 */
console.disableYellowBox = true

const App: () => React$Node = () => {

  const [hasGpsPermission, setGpsPermission] = React.useState(false)
  const [position, setPosition] = React.useState({})

  React.useEffect(() => {
    getLocation()
  }, [])

  async function init() {

  }

 const hasLocationPermission = async () => {
    if(Platform.OS === 'android' && Platform.Version < 23) {
      return true
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    )

    if(hasPermission) return true

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    )

    if(status === PermissionsAndroid.RESULTS.GRANTED) return true

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show('Permissão de localização recusada pelo usuário.', ToastAndroid.LONG)
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show('Permissão de localização revogada pelo usuário.', ToastAndroid.LONG)
    }

    return false

  }

  const getLocation = async () => {
    const _hasLocationPermission = await hasLocationPermission();

    if (!_hasLocationPermission) return;

    Geolocation.getCurrentPosition(
      (position) => {
        setGpsPermission(true)
        setPosition({ location: position })
        console.log(position)
      },
      (error) => {
        setGpsPermission(false)
        setPosition({ location: error})
        console.log(error)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter: 50, forceRequestLocation: true }
    )
  }

  return (
    <Provider store={store}>
      <PaperProvider>
        {hasGpsPermission
          ? (<ConcursoApp />)
          : (
            <View style={{ flex: 1, backgroundColor: '#000000' }}>
              <View>
                <Text style={{ color: '#ffffff', fontSize: 20, fontWeight: 'bold' }}>Desculpe...</Text>
                <Text style={{ color: '#ffffff', fontSize: 16 }}>Concurso da Sorte precisa de sua localização, pois apenas funciona no Brasil.</Text>
              </View>
            </View>
          )
        }
        
      </PaperProvider>
    </Provider>
  );
};


export default App;
