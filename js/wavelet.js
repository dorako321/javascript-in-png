var Wavelet = function() {
    this.coefficient;
    this.width;
    this.height;
    this.disp; // 表示用データ
    this.comp; // 成分情報
    this.context;
    this.bias;
};

Wavelet.prototype = {
    _convertToDisp: function(input) {

    },
    init: function(context, coefficient) {
        this.context = context;

        // 今はhaarのみ
        this.coefficient = 'haar';

        this.bias = 0;
    },
    dwt: function(input) {
        var width = this.width = input.width;
        var height = this.height = input.height;
        if (width % 2 != 0) {
            return
        }
        if (height % 2 != 0) {
            return
        }
        var halfWidth = width >> 1;
        var halfHeight = height >> 1;
        // 変換後データ生成
        this.disp = this.context.createImageData(width, height);
        var output = new Int16Array(4 * width * height);
        var output2 = new Int16Array(4 * width * height);

        // R成分 X方向
        for (var j = 0; j < height; j++) {
            for (var i = 0; i < halfWidth; i++) {
                output[i * 4 + (j * width * 4)] = (input.data[(i * 4 * 2) + (j * width * 4)] + input.data[(i * 4 * 2 + 4) + (j * width * 4)]) / 2;
                output[(halfWidth + i) * 4 + (j * width * 4)] = (input.data[(i * 4 * 2) + (j * width * 4)] - input.data[(i * 4 * 2 + 4) + (j * width * 4)]) / 2;
            }
        }
        // R成分 Y方向
        /*for (var j = 0; j < halfHeight; j++) {
            for (var i = 0; i < width; i++) {
                output2[i * 4 + (j * width * 4)] = (output[(i * 4) + (j * 2 * width * 4)] + output[(i * 4) + ((1 + j * 2) * width * 4)]) / 2;
                output2[i * 4 + ((halfHeight + j) * width * 4)] = (output[(i * 4) + (j * 2 * width * 4)] - output[(i * 4) + ((1 + j * 2) * width * 4)]) / 2;
            }
        }*/
        // G成分 X方向
        for (var j = 0; j < height; j++) {
            for (var i = 0; i < halfWidth; i++) {
                output[1 + i * 4 + (j * width * 4)] = (input.data[(1 + i * 4 * 2) + (j * width * 4)] + input.data[1 + (i * 4 * 2 + 4) + (j * width * 4)]) / 2;
                output[1 + (halfWidth + i) * 4 + (j * width * 4)] = (input.data[(1 + i * 4 * 2) + (j * width * 4)] - input.data[1 + (i * 4 * 2 + 4) + (j * width * 4)]) / 2;
            }
        }
        // G成分 Y方向
        /*for (var j = 0; j < halfHeight; j++) {
            for (var i = 0; i < width; i++) {
                output2[1 + i * 4 + (j * width * 4)] = (output[(1 + i * 4) + (j * 2 * width * 4)] + output[1 + (i * 4) + ((1 + j * 2) * width * 4)]) / 2;
                output2[1 + i * 4 + ((halfHeight + j) * width * 4)] = (output[1 + (i * 4) + (j * 2 * width * 4)] - output[1 + (i * 4) + ((1 + j * 2) * width * 4)]) / 2;
            }
        }*/
        // B成分 X方向
        for (var j = 0; j < height; j++) {
            for (var i = 0; i < halfWidth; i++) {
                output[2 + i * 4 + (j * width * 4)] = (input.data[(2 + i * 4 * 2) + (j * width * 4)] + input.data[2 + (i * 4 * 2 + 4) + (j * width * 4)]) / 2;
                output[2 + (halfWidth + i) * 4 + (j * width * 4)] = (input.data[(2 + i * 4 * 2) + (j * width * 4)] - input.data[2 + (i * 4 * 2 + 4) + (j * width * 4)]) / 2;
            }
        }
        // B成分 Y方向
        /*for (var j = 0; j < halfHeight; j++) {
            for (var i = 0; i < width; i++) {
                output2[2 + i * 4 + (j * width * 4)] = (output[(2 + i * 4) + (j * 2 * width * 4)] + output[2 + (i * 4) + ((1 + j * 2) * width * 4)]) / 2;
                output2[2 + i * 4 + ((halfHeight + j) * width * 4)] = (output[(2 + i * 4) + (j * 2 * width * 4)] - output[2 + (i * 4) + ((1 + j * 2) * width * 4)]) / 2;
            }
        }*/
        // 成分保持用
        this.comp = output;

        // Canvas描画用データ
        for (var j = 0; j < height; j++) {
            for (var i = 0; i < width; i++) {
                this.disp.data[0 + (i * 4) + (j * width * 4)] = output[0 + (i * 4) + (j * width * 4)] + 128;
                this.disp.data[1 + (i * 4) + (j * width * 4)] = output[1 + (i * 4) + (j * width * 4)] + 128;
                this.disp.data[2 + (i * 4) + (j * width * 4)] = output[2 + (i * 4) + (j * width * 4)] + 128;
                this.disp.data[3 + (i * 4) + (j * width * 4)] = 255;
            }
        }

        return this;

    },
    extract: function() {
        // LH成分読み込み
        var halfWidth = this.width >> 1;
        var halfHeight = this.height >> 1;
        var code = '';
        var x = 0;
        //var log = '';
        for (var j = 0; j < this.height; j++) {
            for (var i = halfWidth; i < this.width; i++) {
                var val =
                    this.comp[0 + (i * 4) + (j * this.width * 4)]
                     + (this.comp[1 + (i * 4) + (j * this.width * 4)] << 3)
                     + (this.comp[2 + (i * 4) + (j * this.width * 4)] << 5)
                if (val == 0) {
                    //console.log(code);
                    //console.log('extract:' + log);
                    return code;
                }
                code += String.fromCharCode(val);
                //log += '_' + val;
            }
        }
        //console.log('max:' + code);
        //console.log('extract:' + log);
        return code;
    },

    embed: function(code) {
        //console.log(code);
        var halfWidth = this.width >> 1;
        var halfHeight = this.height >> 1;

        if (halfWidth * halfHeight * 2 < code.length) {
            window.alert('入力制限は' + halfWidth * halfHeight * 2 + 'で、今の文字数は' + code.length);
        }

        // LH成分に埋め込み
        var x = 0;
        var log = '';
        for (var j = 0; j < this.height; j++) {
            for (var i = halfWidth; i < this.width; i++) {
                var val = code.charCodeAt(x);
                var r = val & 7;
                var g = (val >> 3) & 3;
                var b = (val >> 5) & 3;

                //console.log(code.charAt(x) + ' before L:' + this.comp[1 + ((i - halfWidth) * 4) + (j * this.width * 4)] + ' H:' + this.comp[1 + (i * 4) + (j * this.width * 4)] + ' r:' + r + ' g:' + g + ' b:' + b + ' val:' + code.charCodeAt(x));
                // R
                this.comp[0 + (i * 4) + (j * this.width * 4)] = r;
                if (this.comp[0 + ((i - halfWidth) * 4) + (j * this.width * 4)] < r)
                    this.comp[0 + ((i - halfWidth) * 4) + (j * this.width * 4)] = r;

                if (this.comp[0 + ((i - halfWidth) * 4) + (j * this.width * 4)] + r > 255)
                    this.comp[0 + ((i - halfWidth) * 4) + (j * this.width * 4)] = r;

                if (this.comp[0 + ((i - halfWidth) * 4) + (j * this.width * 4)] + r % 2 == 1)
                    this.comp[0 + ((i - halfWidth) * 4) + (j * this.width * 4)] -= 1;
                // G
                this.comp[1 + (i * 4) + (j * this.width * 4)] = g;
                if (this.comp[1 + ((i - halfWidth) * 4) + (j * this.width * 4)] < g)
                    this.comp[1 + ((i - halfWidth) * 4) + (j * this.width * 4)] = g;

                if (this.comp[1 + ((i - halfWidth) * 4) + (j * this.width * 4)] + g > 255)
                    this.comp[1 + ((i - halfWidth) * 4) + (j * this.width * 4)] = g;

                if (this.comp[1 + ((i - halfWidth) * 4) + (j * this.width * 4)] + g % 2 == 1)
                    this.comp[1 + ((i - halfWidth) * 4) + (j * this.width * 4)] -= 1;
                //B
                this.comp[2 + (i * 4) + (j * this.width * 4)] = b;
                if (this.comp[2 + ((i - halfWidth) * 4) + (j * this.width * 4)] < b)
                    this.comp[2 + ((i - halfWidth) * 4) + (j * this.width * 4)] = b;

                if (this.comp[2 + ((i - halfWidth) * 4) + (j * this.width * 4)] + b > 255)
                    this.comp[2 + ((i - halfWidth) * 4) + (j * this.width * 4)] = b;

                if (this.comp[2 + ((i - halfWidth) * 4) + (j * this.width * 4)] + b % 2 == 1)
                    this.comp[2 + ((i - halfWidth) * 4) + (j * this.width * 4)] -= 1;


                //var ra = this.comp[0+((i-halfWidth) * 4) + (j * this.width * 4)];
                //var rb = this.comp[0+(i * 4) + (j * this.width * 4)];
                //var ga = this.comp[1+((i-halfWidth) * 4) + (j * this.width * 4)];
                //var gb = this.comp[1+(i * 4) + (j * this.width * 4)];
                //var ba = this.comp[2+((i-halfWidth) * 4) + (j * this.width * 4)];
                //var bb = this.comp[2+(i * 4) + (j * this.width * 4)];
                //console.log('after L:'+ ra + ' H:'+ rb);
                //console.log('r=' +(ra+rb) +' ' + (ra-rb) + ' g=' +(ga+gb) +' ' + (ga-gb));
                if (x == code.length) {
                    this.comp[0 + (i * 4) + (j * this.width * 4)] = 0 - this.bias;
                    this.comp[1 + (i * 4) + (j * this.width * 4)] = 0 - this.bias;
                    this.comp[2 + (i * 4) + (j * this.width * 4)] = 0 - this.bias;
                    //return this;
                }
                x++;
            }
        }


        // Canvas描画用データ
        this.disp = this.context.createImageData(this.width, this.height);
        for (var j = 0; j < this.height; j++) {
            for (var i = 0; i < this.width; i++) {
                this.disp.data[(i * 4) + (j * this.width * 4)] = this.comp[(i * 4) + (j * this.width * 4)];
                this.disp.data[1 + (i * 4) + (j * this.width * 4)] = this.comp[1 + (i * 4) + (j * this.width * 4)];
                this.disp.data[2 + (i * 4) + (j * this.width * 4)] = this.comp[2 + (i * 4) + (j * this.width * 4)];
                this.disp.data[3 + (i * 4) + (j * this.width * 4)] = 255;
            }
        }

        return this;

    },


    idwt: function(comp) {
        var width = this.width;
        var height = this.height;
        if (width % 2 != 0) {
            return
        }
        if (height % 2 != 0) {
            return
        }
        var halfWidth = width >> 1;
        var halfHeight = height >> 1;

        // 変換後データ生成
        this.disp = this.context.createImageData(width, height);
        var output2 = comp; //new Int16Array(4 * width * height);
        var output = new Int16Array(4 * width * height);

        // R成分 Y方向逆変換
        /*for (var j = 0; j < halfHeight; j++) {
            for (var i = 0; i < width; i++) {
                // invert to a
                output2[(i * 4) + (j * 2 * width * 4)] 
                = comp[i * 4 + (j * width * 4)] + comp[i * 4 + ((halfHeight + j) * width * 4)];
                // invert to b
                output2[(i * 4) + ((1 + j * 2) * width * 4)] 
                = comp[i * 4 + (j * width * 4)] - comp[i * 4 + ((halfHeight + j) * width * 4)];
            }
        }*/

        // R成分 X方向逆変換
        for (var j = 0; j < height; j++) {
            for (var i = 0; i < halfWidth; i++) {
                output[(i * 4 * 2) + (j * width * 4)] = output2[i * 4 + (j * width * 4)] + output2[(halfWidth + i) * 4 + (j * width * 4)];
                output[(i * 4 * 2 + 4) + (j * width * 4)] = output2[i * 4 + (j * width * 4)] - output2[(halfWidth + i) * 4 + (j * width * 4)];
            }
        }

        // G成分 Y方向逆変換
        /*for (var j = 0; j < halfHeight; j++) {
            for (var i = 0; i < width; i++) {
                // invert to a
                output2[1 + (i * 4) + (j * 2 * width * 4)] = comp[1 + i * 4 + (j * width * 4)] + comp[1 + i * 4 + ((halfHeight + j) * width * 4)];
                // invert to b
                output2[1 + (i * 4) + ((1 + j * 2) * width * 4)] = comp[1 + i * 4 + (j * width * 4)] - comp[1 + i * 4 + ((halfHeight + j) * width * 4)];
            }
        }*/

        // G成分 X方向逆変換
        for (var j = 0; j < height; j++) {
            for (var i = 0; i < halfWidth; i++) {
                output[1 + (i * 4 * 2) + (j * width * 4)] = output2[1 + i * 4 + (j * width * 4)] + output2[1 + (halfWidth + i) * 4 + (j * width * 4)];
                output[1 + (i * 4 * 2 + 4) + (j * width * 4)] = output2[1 + i * 4 + (j * width * 4)] - output2[1 + (halfWidth + i) * 4 + (j * width * 4)];
            }
        }

        // B成分 Y方向逆変換
        /*for (var j = 0; j < halfHeight; j++) {
            for (var i = 0; i < width; i++) {
                // invert to a
                output2[2 + (i * 4) + (j * 2 * width * 4)] = comp[2 + i * 4 + (j * width * 4)] + comp[2 + i * 4 + ((halfHeight + j) * width * 4)];
                // invert to b
                output2[2 + (i * 4) + ((1 + j * 2) * width * 4)] = comp[2 + i * 4 + (j * width * 4)] - comp[2 + i * 4 + ((halfHeight + j) * width * 4)];
            }
        }*/

        // B成分 X方向逆変換
        for (var j = 0; j < height; j++) {
            for (var i = 0; i < halfWidth; i++) {
                output[2 + (i * 4 * 2) + (j * width * 4)] = output2[2 + i * 4 + (j * width * 4)] + output2[2 + (halfWidth + i) * 4 + (j * width * 4)];
                output[2 + (i * 4 * 2 + 4) + (j * width * 4)] = output2[2 + i * 4 + (j * width * 4)] - output2[2 + (halfWidth + i) * 4 + (j * width * 4)];
            }
        }

        // Canvas描画用データ
        this.disp = this.context.createImageData(this.width, this.height);
        for (var j = 0; j < height; j++) {
            for (var i = 0; i < width; i++) {
                this.disp.data[(i * 4) + (j * width * 4)] = output[(i * 4) + (j * width * 4)];
                //this.disp.data[1+(i * 4) + (j * width * 4)] = output[(i * 4) + (j * width * 4)];
                //this.disp.data[2+(i * 4) + (j * width * 4)] = output[(i * 4) + (j * width * 4)];
                this.disp.data[(1 + i * 4) + (j * width * 4)] = output[1 + (i * 4) + (j * width * 4)];
                this.disp.data[(2 + i * 4) + (j * width * 4)] = output[2 + (i * 4) + (j * width * 4)];
                this.disp.data[3 + (i * 4) + (j * width * 4)] = 255;
            }
        }

        return this;
    }


}
