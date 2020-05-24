# cropper

There are many cropper tools, but this one is mine.

## Usage

```
window.cropper(file, width, height, function(data) {
    console.log(data);
});
```

### Arguments

 - **file** - This is a File Object
 - **width** - The desired width. Set this to `0` if you want it relative to height
 - **height** - The desired height. Set this to `0` if you want it relative to width

### Return

The callback will receive base64 encoded data containing the final cropped image.

## Sample

```
var file = document.getElementById('file-input');

file.addEventListener('change', function() {
    if(!this.files || !this.files[0]) {
        return;
    }

    cropper(this.files[0], 100, 0, function(data) {
        document.getElementById('image').src = data;
        document.getElementById('hidden').value = data;
    });
});
```


You can also use jQuery as in

```
$.cropper(file, width, height, function(data) {
    console.log(data);
});
```

an example would look like

```
$('input[type="file"]').change(function() {
    if(!this.files || !this.files[0]) {
        return;
    }

    $.cropper(this.files[0], 100, 0, function(data) {
        $('img', row).attr('src', data);
        $('input[type="hidden"]').val(data);
    });
});
```
