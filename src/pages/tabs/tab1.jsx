import { Button } from '@nutui/nutui-react-taro';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useEffect } from 'react';
import useFetch from '../../lib/useFetch';

const Index = () => {
  const { get, loading } = useFetch();
  Taro.setNavigationBarTitle({ title: '第一个tab' });

  useEffect(() => {
    console.log(loading, get);
  }, []);

  return (
    <View>
      <Button openType='share' className='mx-[22px] px-2.5 text-red-500 bg-black'>
        Tab1
      </Button>
    </View>
  );
}

export default Index;
