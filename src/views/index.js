import React from 'react'
import { Image, View } from 'react-native'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
import { createStackNavigator } from 'react-navigation-stack'
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch'
import { Transition } from 'react-native-reanimated'

import Authenticate from './auth'
import Login from './login'
import CreateAccount from './createAccount'
import LostPassword from './lostpassword'
import CardRegister from './cardRegister'
import UserConfirmation from './userConfirm'
import Tutorial from './tutorial'
import Contests from './contests'
import Winners from './winners'
import Perfil from './perfil'
import Settings from './settings'
import Tickets from './tickets'
import BuyTicket from './buyTicket'
import appSwitcher from './appSwitcher'
import FinishBuy from './finishBuy'
import NewCard from './newCard'
import Payment from './payment'
import ChangeName from './changeName'
import ChangeEmail from './changeEmail'
import ChangeTel from './changeTel'
import ChangePassword from './changePassword'
import VerifyEmail from './verifyEmail'
import VerifyCode from './verifyCode'
import ResetPassword from './resetPassword'
import LegalInformation from './legalInformation'

const BottomTabStack = createMaterialBottomTabNavigator(
    {
        Contests: {
            screen: Contests,
            navigationOptions: {
                tabBarLabel: 'Concursos',
                tabBarIcon: ({ tintColor }) => (
                    <View>
                        <Image 
                            source={require('../assets/images/icon-home.png')}
                            resizeMode='cover'  
                            style={{ width: 25, height: 25 }}    
                            tintColor={tintColor}
                        />
                    </View>
                ),
                activeColor: '#FFFFFF',
                inactiveColor: '#808080',
            }
        },
        Winners: {
            screen: Winners,
            navigationOptions: ({navigation}) => ({
                tabBarLabel: 'Ganhadores',
                tabBarIcon: ({ tintColor }) => (
                    <View>
                        <Image 
                            source={require('../assets/images/icon-ganhadores.png')}
                            resizeMode='cover'  
                            style={{ width: 25, height: 25 }}    
                            tintColor={tintColor}
                        />
                    </View>
                ),
                activeColor: '#FFFFFF',
                inactiveColor: '#808080',
                
            }),

        },
        Settings: {
            screen: Settings,
            navigationOptions: {
                tabBarLabel: 'Meus Dados',
                tabBarIcon: ({ tintColor }) => (
                    <View>
                        <Image 
                            source={require('../assets/images/icon-configura.png')}
                            resizeMode='cover'  
                            style={{ width: 25, height: 25 }}    
                            tintColor={tintColor}
                        />
                    </View>
                ),
                activeColor: '#FFFFFF',
                inactiveColor: '#808080',
            }
        },
        Tickets: {
            screen: Tickets,
            navigationOptions: {
                tabBarLabel: 'Bilhetes',
                tabBarIcon: ({ tintColor }) => (
                    <View>
                        <Image 
                            source={require('../assets/images/icon-lista.png')}
                            resizeMode='cover'  
                            style={{ width: 25, height: 25 }}    
                            tintColor={tintColor}
                        />
                    </View>
                ),
                activeColor: '#FFFFFF',
                inactiveColor: '#808080',
            }
        },
        
    },
    {
        initialRouteName: 'Contests',
        backBehavior: 'initialRoute',
        order: ['Contests', 'Winners', 'Tickets', 'Settings'],
        labeled: true,
        shifting: false,
        barStyle: {
            backgroundColor: '#000000'
        },
        navigationOptions: ({navigation}) => {
            var { index } = navigation.state
            var activeRoute = navigation.state.routes[index].routeName
            // console.log(activeRoute)
            // navigation.state.routes.map( route => {
            //     if(route.routeName != activeRoute) {
            //         // console.log(route.routeName)
            //         navigation.navigate(route.routeName)
            //     }
            // })
        },
    }
)

const MediumStack = createStackNavigator(
    {
        BottomTabStack,
        BuyTicket: {
            screen: BuyTicket,
            navigationOptions: {
                headerShown: false
            }
        },
        FinishBuy: {
            screen: FinishBuy,
            navigationOptions: {
                headerShown: false
            }
        },
        Perfil: {
            screen: Perfil,
            navigationOptions: {
                headerShown: false
            }
        },
        Payment: {
            screen: Payment,
            navigationOptions: {
                headerShown: false
            }
        },
        NewCard: {
            screen: NewCard,
            navigationOptions: {
                headerShown: false
            }
        },
        ChangeName: {
            screen: ChangeName,
            navigatoin: {
                headerShown: false
            }
        },
        ChangeEmail: {
            screen: ChangeEmail,
            navigatoin: {
                headerShown: false
            }
        },
        LegalInformation: {
            screen: LegalInformation,
            navigatoin: {
                headerShown: false
            }
        },
        ChangeTel: {
            screen: ChangeTel,
            navigatoin: {
                headerShown: false
            }
        },
        ChangePassword: {
            screen: ChangePassword,
            navigatoin: {
                headerShown: false
            }
        },
    },
    {
        initialRouteName: 'BottomTabStack',
        mode: 'modal',
        headerMode: 'none'
    }
)

const AuthStack = createStackNavigator(
    {
        Login: {
            screen: Login,
        },
        LostPassword: {
            screen: LostPassword,
        },
        VerifyEmail: {
            screen: VerifyEmail,
        },
        VerifyCode: {
            screen: VerifyCode,
        },
        ResetPassword: {
            screen: ResetPassword,
        },
        CreateAccount: {
            screen: CreateAccount,
        },
        UserConfirmation: {
            screen: UserConfirmation,
        },
        CardRegister: {
            screen: CardRegister,
        },
    },
    {
        mode: "modal",
        headerMode: 'none',
        initialRouteName: 'Login',
    }
)


const AppStack = createSwitchNavigator(
    {
        AppSwitch: appSwitcher,
        Tutorial: Tutorial,
        InsideApp: MediumStack
    },
    {
        mode: "modal",
        headerMode: 'none',
        initialRouteName: 'AppSwitch',
    }
)

const SwitchStack = createAnimatedSwitchNavigator(
    {
        AuthLoading: Authenticate,
        App: AppStack,
        Auth: AuthStack
    },
    {
      initialRouteName: 'AuthLoading',
      backBehavior: 'history',
      transition: (
        <Transition.Together>
          <Transition.Out
            type="slide-left"
            durationMs={400}
            interpolation="easeIn"
          />
          <Transition.In type="slide-right" durationMs={500} />
        </Transition.Together>
      ),
    }
)

const ConcursoApp = createAppContainer(SwitchStack)

export default ConcursoApp
