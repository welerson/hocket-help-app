import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { VStack, Text, useTheme, HStack, ScrollView } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { OrderFirestoreDTO } from '../components/DTOs/OrderDTO';
import { Input } from '../components/input';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { dateFormat } from '../utils/firestoreDateFormat';
import { OrderProps } from '../components/Order';
import { Loading } from '../components/Loading';
import { CircleWavyCheck, Hourglass, DesktopTower, Clipboard } from 'phosphor-react-native';
import { CardDetails } from '../components/CardDetails';

type RouteParams = {
  orderId: string;
}

type OrderDatails = OrderProps & {
  description: string;
  sulution: string;
  closed: string;
}

export function Datails() {
  const [solution, setSolution] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<OrderDatails>({}as OrderDatails);

  const navigation = useNavigation();
  const { useTheme } = useTheme();
  const route = useRoute();

  const { orderId } = route.params as RouteParams;

  function handleOrderClose(){
    if(!solution){
      return Alert.alert('Solicitação', 'Informe a solução para encerrar a solicitação')
    }

    firestore()
    .collection<OrderFirestoreDTO>('orders')
    .doc(orderId)
    .update({
      status: 'closed',
      solution,
      closed_at: firestore.FieldValue.serverTimestamp()
    })

    .then(() =>{
      Alert.alert('Solicitação', 'Solicitação encerrada.');
      navigation.goBack();
    })
    .catch((error) => {
      console.log(error);
      Alert.alert('Solicitação', 'Não foi possível encerrar a solicitação.');
    })
  }

  useEffect(() => {
    firestore()
    .collection<OrderFirestoreDTO>('orders')
    .doc(orderId)
    .get()
    .then((doc) =>{
      const { patrimonio, description, status, created_at, closed_at, solution } = doc.data();

      const closed = closed_at ? dataFormat(closed_at) : null;

      setOrder({
        id: doc.id,
        patrimonio,
        description,
        status,
        solution,
        quando: dateFormat(created_at),
        closed
      });

      setIsLoading(false);
    });

  }, []);

  if (isLoading) {
    return <Loading />
  }

  return (
    <VStack flex={1} bg="gray.700" >
    <Box px={6} bg="gray.600">
       <Header title="solicitação" />
    </Box>

    <HStack bg="gray.500" ustifyContent="center" p={4} >
      {
        order.status === 'closed'
        ? <CircleWavyCheck size={22} color={colors.green[300]} />
        : <Hourglass size={22} color={colors.secondary[700]} />
      }

      <Text
      fontSize="sm"
      color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
      ml={2}
      textTransform="uppercase"

      >
        {order.status === 'closed' ? 'finalizado' : 'em andamento'}

      </Text>
    </HStack>

    <ScrollView mx={5} showsVerticalScrollIndicator={false} >
      <CardDetails 
      title="equipamento"
      description={`Patrimônio ${order.patrimonio}`}
      icon={DesktopTower}
      footer={order.quando}

      />

      <CardDetails 
      title="descrição do problema"
      description={order.description}
      icon={Clipboard}
      
      />

      
<CardDetails 
      title="solução"
      icon={CircleWavyCheck}
      description={order.solution}
      footer={order.closed && `Encerrado em ${order.closed}`}
      >
        {
          order.status === 'open' &&
        <Input 
        placeholder="Descrição da solução"
        onChangeText={setSolution}
        h={24}
        textAlignVertical="top"
        multiline

         />
        }
      </CardDetails>
    </ScrollView>

    {
      order.status === 'open' &&
      <Button
      title="Encerrar solicitação"
      m={5}
      onPress={handleOrderClose}
       />
    }
    </VStack>
  );
}