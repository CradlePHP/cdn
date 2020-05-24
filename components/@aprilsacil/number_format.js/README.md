# number_format

jQuery/Javascript equivalent of number_format in PHP

## Usage

### Direct formatting
1. basic
    ```javascript
    $.number_format('12345.6789'); // Outputs 12,345
    ```
2. decimal places -- default is 0
    ```javascript
    $.number_format('12345.6789', 2); // Outputs 12,345.68
    ```
3. decimal separator -- default is '.'
    ```javascript
    $.number_format('12345.6789', 2, 'xx'); // Outputs 12,345xx68
    ```
4. thousands separator -- default is ','
    ```javascript
    $.number_format('123456789', 0, '.', ','); // Outputs 123,456,789
    ```
### Element formatting
assuming we have:
```html
    <div class="prices">
        <span class="price">12434.445</span>
        <span class="price">123434545</span>
        <span class="price">12345.7834893748973</span>
        <span class="price">15.56</span>
    </div>
```

the script:
```javascript
    $('.price').number_format(2, '.', ',');
```

will convert it to:
```html
    <div class="prices">
      <span class="price">12,434.45</span>
      <span class="price">123,434,545</span>
      <span class="price">12,345.78</span>
      <span class="price">15.56</span>
    </div>
```
