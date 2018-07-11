# Select

##

<pre>
Select
  OptionGroup(TODO)
  Option              <--       OptionWithConsumer
</pre>

fiterable guocheng
> onChange[Input]   
-> inputValue[Select state]           过程变量（输入的时候）
-> Options  
-> onClick[Option]  
-> optionClick[Select]
-> selectedValue = option.props.value  
-> onChange(selectedValue)[Select]
-> getDerivedStateFromProps           更新selectedValue

TODO:  
1. OptionGroup
2. `multiple`
3. 下拉显示/隐藏 交互优化
4. √ ~~`suggest`~~
5. 将 dropdown 放到最外层
6. ***debounce***
7. clearable
8. 没有匹配选项时 提示
9. `可以通过 props 传入一个 function 自定义过滤规则`
