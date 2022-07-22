import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Home } from "../screens/Home";
import { Datails } from "../screens/Datails";
import { Register } from "../screens/Register";

const {Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes() {
  return(
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="home" component={Home} />
      <Screen name="new" component={Register} />
      <Screen name="datails" component={Datails} />

    </Navigator>
  )
}