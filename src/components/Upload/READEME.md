# upload

## 

TODO:

1. abort
2. uploadList (ing)
3. progress
4. hover icon
5. delete
6. main picture

## upload 流程
<pre>
onChange(input[type=file]) => upload => beforeUpload => post => request => onStart => setState/update props => UploadList
                                                                        => onProgress => onSuccess/onError 
                                                                        (上传过程中的 hook 都会 setState/update props)
                                                                        onProgress (status: uploading, percent)
                                                                        onSuccess (status: done)
                                                                        onError (status: error, error: error)
</pre>
> onStart 的时候已经将 File 对象上传了，这个时候将 File 对象转换成易操作的对象(fileToObject)，（onStart之前转换也行，不过这样更合理）  
> upload 之前，获取一个 uid 给 File 对象，可以方便后面 remove abort等操作。

## 问题

onClick 冒泡 react 事件机制 -> 事件委托