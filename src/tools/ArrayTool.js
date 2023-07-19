class ArrayTool {
  /** 随机打乱数组,会直接改变原数组的顺序 ** */
  static shuffle(nodes) {
    let index = -1;
    const { length = 0 } = nodes || {};
    const lastIndex = length - 1;
    // eslint-disable-next-line no-plusplus
    while (++index < length) {
      const rand = index + Math.floor(Math.random() * (lastIndex - index + 1))
      const value = nodes[rand];
      nodes[rand] = nodes[index];
      nodes[index] = value;
    }
    nodes.length = length;
    return nodes;
  }

  /**
   * 根据目标数组和概率数组，按照概率随机返回，数组中的元素
   * @param array [item, ...]
   * @param rates 如：[1, 2, 5] or [0.2, 0.3, 0.5]
   * @returns item|null
   */
  static randomItemByRates(array, rates) {
    // 确保数组和概率数组的长度相同
    if (array.length !== rates.length) {
      throw new Error('数组和概率数组的长度不一致');
    }
    // 计算概率总和
    const totalProbability = rates.reduce((sum, probability) => sum + probability, 0);
    // 生成一个随机数
    const random = Math.random() * totalProbability;
    // 根据随机数和概率分布找到对应的元素
    let cumulativeProbability = 0;
    for (let i = 0; i < array.length; i++) {
      cumulativeProbability += rates[i];
      if (random < cumulativeProbability) {
        return array[i];
      }
    }
    // 如果概率总和为0，则返回null
    return null;
  }

  /**
   * 从目标数组中随机获取指定个数的元素
   * @param array 目标数组
   * @param count 获取指定个数
   * @returns {*} 随机获取的 指定个数元素 数组
   */
  static randomItemCount(array, count) {
    const tempArray = [...array]; // 解构一份，防止array被打乱顺序
    const shuffled = tempArray.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}

export default ArrayTool;
