/*
 * XWJ日期插件
 * */
$('.input-daterange').datepicker({

    format: {

        toDisplay: function (date, format, language) {

            var yearnumber = new Date(date).getFullYear();
            var monthnumber = new Date(date).getMonth();
            var daynumber = new Date(date).getDate();
            var month = new Array(12);
            month[0] = "01";
            month[1] = "02";
            month[2] = "03";
            month[3] = "04";
            month[4] = "05";
            month[5] = "06";
            month[6] = "07";
            month[7] = "08";
            month[8] = "09";
            month[9] = "10";
            month[10] = "11";
            month[11] = "12";
            var day = new Array();
            day[0] = "00";
            day[1] = "01";
            day[2] = "02";
            day[3] = "03";
            day[4] = "04";
            day[5] = "05";
            day[6] = "06";
            day[7] = "07";
            day[8] = "08";
            day[9] = "09";
            day[10] = "10";
            day[11] = "11";
            day[12] = "12";
            day[13] = "13";
            day[14] = "14";
            day[15] = "15";
            day[16] = "16";
            day[17] = "17";
            day[18] = "18";
            day[19] = "19";
            day[20] = "20";
            day[21] = "21";
            day[22] = "22";
            day[23] = "23";
            day[24] = "24";
            day[25] = "25";
            day[26] = "26";
            day[27] = "27";
            day[28] = "28";
            day[29] = "29";
            day[30] = "30";
            day[31] = "31";

            return yearnumber + "-" + month[monthnumber] + "-" + day[daynumber];

        },
        toValue: function (date, format, language) {

        }
    }

});
