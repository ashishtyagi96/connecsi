/**
 * Created by ashishtyagi9622 on 17/6/19.
 */
var massPopChart =null;

// function for calculating rating of influencer

function calculateRating(data) {
    if(data==0){
        return 0;
    }
    if(data<100){
        return 1;
    }
    else if(data>=100&&data<500){
        return 1.5;
    }
    else if(data>=500&&data<1000){
        return 2;
    }
    else if(data>=1000&&data<5000){
        return 2.5;
    }
    else if(data>=5000&&data<10000){
        return 3;
    }
    else if(data>=10000&&data<20000){
        return 4;
    }
    else if(data>=20000&&data<50000){
        return 4.5;
    }
    else{
        return 5;
    }
}

//----------------------------------------------

// function for getting the chart rendered with json data received

function getChart(label,like) {
    Chart.pluginService.register({
        beforeDraw: function (chart, easing) {
            if (chart.config.options.chartArea && chart.config.options.chartArea.backgroundColor) {
                var helpers = Chart.helpers;
                var ctx = chart.chart.ctx;
                var chartArea = chart.chartArea;

                ctx.save();
                ctx.fillStyle = chart.config.options.chartArea.backgroundColor;
                ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
                ctx.restore();
            }
        }
    });

    if(massPopChart!=null){
        massPopChart.destroy();
    }
    var myChart = document.getElementById('myChart').getContext('2d');

    Chart.defaults.global.defaultFontColor = "#fff";

    massPopChart = new Chart(myChart, {
        type:'line',
        data:{
            labels:label,
            datasets:[{
                label:'NUMBER OF LIKES',
                data: like,
                backgroundColor:[
                    'rgba(255,99,132,0.6)',
                    'rgba(255,99,132,0.6)',
                    'rgba(255,99,132,0.6)',
                    'rgba(255,99,132,0.6)',
                    'rgba(255,99,132,0.6)'
                ],
                borderWidth: 1,
                borderColor: '#b8b8b8',
                hoverBorderWidth: 3,
                hoverBorderColor: '#00f01a',
                hoverPointer: 'cursor'
            }]
        },
        options:{
            responsive:true,
            title:{
                display:true,
                text:'LIKES VS POSTS'
            },
            legend:{
                position:'bottom'
            },
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'LAST FIVE POSTS'
                    },
                    ticks: {
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: 90
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'NUMBER OF LIKES'
                    }
                }]
            },
            chartArea: {
                backgroundColor: 'rgb(255, 255, 255)'
            },
            plugins: {
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    backgroundColor: null,
                    borderColor: null,
                    borderRadius: 4,
                    borderWidth: 1,
                    color: '#223388',
                    font: function (context) {
                        var width = context.chart.width;
                        var size = Math.round(width / 32);
                        return {
                            size: size,
                            weight: 600
                        };
                    },
                    offset: 4,
                    padding: 0,
                    formatter: function (value) {
                        return Math.round(value * 10) / 10
                    }
                }
            }
        }
    });
}

//----------------------------------------------


// function for calculating average likes, comments and views

function calcaulateAverage(data) {
    var arr={};
    var views=0;
    var likes=0;
    var comments=0;
    for(var i=0;i<data.length;i++){
        views=views+data[i].no_of_post_views;
        likes=likes+data[i].no_of_post_likes;
        comments=comments+data[i].no_of_post_comments;
    }
    arr.avg_views=Math.round(views/data.length);
    arr.avg_likes=Math.round(likes/data.length);
    arr.avg_comments=Math.round(comments/data.length);
    if(isNaN(arr.avg_likes)){
        arr.avg_likes=0;
    }
    if(isNaN(arr.avg_views)){
        arr.avg_views=0;
    }
    if(isNaN(arr.avg_comments)){
        arr.avg_comments=0;
    }
    return arr;
}

//----------------------------------------------


//function for conversion of followers, views, likes and comments into M and K

function convertion(data) {
    var value;
    if(data>99999){

        data=data/100000;
        var m = Math.round(data * 100) / 100;
        value = m+'M';
    }
    else if(data>1000){
        data=data/1000;
        var m = Math.round(data * 100) / 100;
        value=m+'K';
    }
    else{
        value=data
    }
    return value;
}

//-------------------------------------------------

// function to check empty object


function isEmpty(obj) {
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}


//--------------------------------------------------

// function on submitting the form for channel search

function searchChannel() {

    var channelName = document.getElementsByClassName('form-inline')[0].childNodes[1].value;
    if(channelName.includes(" ")){
        document.getElementsByClassName('data-display')[0].style.display='none';
        document.getElementsByClassName('message')[0].style.display='flex';
        document.getElementsByClassName('errorMessage')[0].childNodes[1].innerText='Username cannot contain spaces';
        return false;
    }
    if(channelName==''){
        document.getElementsByClassName('data-display')[0].style.display='none';
        document.getElementsByClassName('message')[0].style.display='flex';
        document.getElementsByClassName('errorMessage')[0].childNodes[1].innerText='Username cannot empty';
        return false;
    }

    var influencer_name;
    var influencer_image;
    var total_followers;
    var average_views;
    var average_likes;
    var average_comments ;
    $.ajax({
            type: 'GET',
            url: "/getData",
            success:function(data){
                influencer_name=data[0].page_data.username;
                business_category_name=data[0].page_data.business_category_name;
                influencer_image=data[0].page_data.channel_img;
                total_followers=data[0].page_data.no_of_followers;
                var v = calcaulateAverage(data[0].post_data);
                total_followers=convertion(total_followers);
                average_views=convertion(v.avg_views);
                average_likes=convertion(v.avg_likes);
                average_comments=convertion(v.avg_comments);
                document.getElementsByClassName('message')[0].style.display='none';
                document.getElementsByClassName('data-display')[0].style.display='block';
                document.getElementsByClassName('influencer-name')[0].childNodes[1].innerText=influencer_name;
                document.getElementsByClassName("influence-img")[0].childNodes[1].src=influencer_image;
                document.getElementsByClassName("influence-rating")[0].childNodes[3].innerText=business_category_name;
                document.getElementsByClassName("influence-followers")[0].childNodes[1].innerText=total_followers;
                document.getElementsByClassName("influence-average-views")[0].childNodes[1].innerText=average_views;
                document.getElementsByClassName("influence-average-likes")[0].childNodes[1].innerText=average_likes;
                document.getElementsByClassName("influence-average-comments")[0].childNodes[1].innerText=average_comments;
                document.getElementsByClassName("progress-bar-green")[0].style.width=(calculateRating(data[0].page_data.no_of_followers)/5)*100+'%';
                document.getElementsByClassName("influence-rating")[0].childNodes[1].innerText=calculateRating(data[0].page_data.no_of_followers)+'%';
                var label=[];
                var like=[];
                if(isEmpty(data[0].post_data)){
                    document.getElementsByClassName("chart-mine")[0].style.display="none";
                }
                else{
                    document.getElementsByClassName("chart-mine")[0].style.display="block";
                    for(var j=0;j<data[0].post_data.length&&j<5;j++){
                        label.push((data[0].post_data[j].post_time).substring(0,10));
                        like.push(data[0].post_data[j].no_of_post_likes);
                    }
                    getChart(label,like);
                }
            }
        });

    return false;


}

//------------------------------------------------------
