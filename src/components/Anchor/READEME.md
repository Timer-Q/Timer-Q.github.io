# anchor

## 设计思路

###

> 注： 为了方便 anchor 和 menu 联动，href 与 id 设置与 menuItem 对应的 index 一致

> MenuItem 中的 props 都传递到 Link 中了，可以在 Link 中激活 Menu

<pre>
    mounted -> links
    links: {contentId(href)}
    scrollListener() -> top -> isFixed
                     -> links(some) ->  (contentOffset <= pageYOffset <= contentOffset + contentHeight) -> href
</pre>
