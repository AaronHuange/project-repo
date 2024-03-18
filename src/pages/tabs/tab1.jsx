import { Button, SearchBar } from '@nutui/nutui-react-taro';
import { Text, View } from '@tarojs/components';
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
      <View className='flex'>
        <SearchBar className='bg-white border border-gray-300 border-solid' leftIn={<View className='w-12 flex items-center' onClick={() => {}}><Text>测试</Text></View>} />
        <View className='flex-none px-2 flex items-center border border-gray-300 border-solid border-l-0'>搜索</View>
      </View>
    </View>
  );
}

export default Index;
