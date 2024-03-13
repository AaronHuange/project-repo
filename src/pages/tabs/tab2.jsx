import { Button } from '@nutui/nutui-react-taro';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';

const Index = () => {
  Taro.setNavigationBarTitle({ title: '第二个tab' });

  return (
    <View>
      <Button openType='share' className='mx-5 text-red-500 bg-black'>
        Tab2
      </Button>
    </View>
  );
}

export default Index;
