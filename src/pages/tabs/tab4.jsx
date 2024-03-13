import { Button } from '@nutui/nutui-react-taro';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';

const Index = () => {
  Taro.setNavigationBarTitle({ title: '第四个tab' });

  return (
    <View>
      <Button openType='share' className='mx-5 text-red-500 bg-black'>
        Tab4
      </Button>
    </View>
  );
}

export default Index;
