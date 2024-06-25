interface Window {
  BMapGL: {
    // 它表示 BMapGL 对象可以有任何数量的属性，这些属性的名字是字符串类型，并且这些属性的值可以是任何类型（由于 any 类型）
    [propName: string]: any
  }
  BMapGLLib: any
  BMapLib: any
}
