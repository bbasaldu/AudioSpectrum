//https://developer.mozilla.org/en-US/docs/Web/API/AudioNode
//https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
//https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
//https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API

//no copyright
const defaultSong = "TrapTitans_Pinnacle.mp3";
const pow = 3;
const radialMargin = 25;
const maxHz = 44100/2; //We can only get data on half the sample rate, max hz our data gives us
const maxHumanHz = 20000; //upper limit of human hearing
const margin = 0;
const dim = {w: window.innerWidth-margin, h: window.innerHeight-margin};


var width = 1000;//dim.w;//1000
var height = 650;//dim.h;//650
window.mobileCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
//mobile version -> scale up a bit
//desktop version -> add some auto centering and drag n drop ui.
if(window.mobileCheck()){
    height = height * 2;
}
else {
    //showDropZone();
    window.onresize = function (){resize(window.innerWidth/2, window.innerHeight/2)};
}
d3.select('#name').attr('class', 'h4')
var div = d3.select('body')
    .style('position', 'relative')
    .append('div')
    .style('position', 'relative')
var svg = div.append('svg')
    .style('position', 'relative')
    //.attr("preserveAspectRatio", "xMinYMin meet")
    //.attr('viewBox', `0 0 ${width} ${height}`)
    .attr('width', width)
    .attr('height', height)
    //.style('transform', 'translate(500, 500)')
    //.style('display', 'block')
    //.style('margin', 'auto')
    .on('load', () => {resize(dim.w/2, dim.h/2); if(!window.mobileCheck()) showDropZone()})
//https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser


function resize(w,h){
    
    var bbox = svg.node().getBoundingClientRect();
    var x = w - (bbox.width/2)
    var y = h - (bbox.height/2);
    //works on all browsers vs attr transform.
    svg.style('left', x+'px').style('top', y+'px')
    //svg.attr('transform', `translate(${x}, ${y})`)
}


var bins = 256;
var data = []
for(var i=0; i<bins; i++) data.push({value: 1, stat: 'group'+i, arc: null})

//largest unsigned 8bit int
var maxValue = 255;
var dimScale = 1.0;
var outerRadius = Math.min(width*dimScale, height*dimScale)/2 - radialMargin;
var innerRadius = outerRadius/1.5

var xScale = d3.scaleBand().range([0, 2 * Math.PI]).domain(data.map(d => d.stat));
var yScale = d3.scaleRadial().range([innerRadius, outerRadius]).domain([0, Math.pow(maxValue, pow)]);
var xLinear = d3.scaleLinear().range([0, xScale.bandwidth()]).domain([0, 1]);
var hzScale = d3.scaleLinear().range([0, 2 * Math.PI]).domain([0, maxHz]);
var tickLine = d3.lineRadial()
var valueScale = d3.scaleLinear().range([0, maxHz]).domain([0, bins-1])
var colorScale = d3.scalePow().exponent([1/2]).domain([0, Math.pow(maxValue, pow)]).range([0, 1])
var group = svg.append('g')
    .attr('id', 'stats')
    .attr('transform', 'translate('+(width/2)+','+(height/2)+')')

var Chart = group.selectAll('freqBands')
    .data(data).enter()
    .append('path')
    .attr('id', (d,i) => 'd'+i)
    .attr('fill', '#fff')
    .attr('d', d => {
        var arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(yScale(d.value))
        .startAngle(xScale(d.stat))
        .endAngle(xScale(d.stat)+xScale.bandwidth())
        .cornerRadius(5);
        d.arc = arc;
        return arc();
    })
function bbox(text){
    var text = svg.append('text')
        .attr('font-size', tickFont)
        .text(text)
    
    var bbox = text.node().getBoundingClientRect()
    text.remove()
    
    return bbox
}

var tickSize = 10;
var tickFont = '12px';

var toRad = Math.PI/180.0;
var angleOffset = Math.PI/2;
var hearingRangeVisible = false;

var bin = maxHz/bins;
var twentyHZ = 20 / bin;
var HZ = maxHumanHz/bin;
var gi = Math.round(HZ) - 1;
var startAngle = xScale('group0')
var endAngle = xScale('group'+gi) + xLinear(HZ % 1)
var offset = 0.002;
var baseArc = d3.arc().innerRadius(outerRadius).outerRadius(outerRadius)
var hrStart = xLinear(twentyHZ);
var hrEnd = xScale('group'+gi) + xLinear(HZ % 1);
var hrArc = {startAngle: hrStart, endAngle: hrEnd};
var bhrStart = endAngle;
var bhrEnd = (360*toRad)+xLinear(twentyHZ);
var bhrArc = {startAngle: bhrStart, endAngle: bhrEnd};
var easeTick = d3.easeBounceOut;
var easeTickOut = d3.easeQuadOut;
var easeTickTime = 2000;
var easeText = d3.easeQuadIn;
var easeTextTime = 1000;

var hrVisible = false;
function showHearingRange(){
    var rangeGroup = group.append('g').attr('id', 'rangeGroup')
    
    var hr = rangeGroup.append('path')
        .attr('id', 'hearingRange')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
        .transition()
            .duration(2000)
            .ease(d3.easeBounceOut)
            .attrTween('d', () => tweenPathIn(baseArc, hrStart, hrStart, hrArc))
        .on('start', () => hrBtn.attr('pointer-events', 'none'))
        .on('end', () => hrBtn.attr('pointer-events', 'auto'))
    
    var bhrStart = endAngle;
    var bhrEnd = (360*toRad)+xLinear(twentyHZ);
    var bhrArc = {startAngle: bhrStart, endAngle: bhrEnd};
    var bhr = rangeGroup.append('path')
        .attr('id', 'beyondHearingRange')
        .attr('stroke', '#fff')
        .attr('stroke-dasharray', 3)
        .attr('stroke-width', 1)
        .transition()
            .duration(2000)
            .ease(d3.easeBounceOut)
            .attrTween('d', () => tweenPathIn(baseArc, bhrEnd, bhrEnd, bhrArc))
    
    var bhrLength = bhr.node().getTotalLength()
    
    rangeGroup.append('text')
        .attr('fill', '#fff')
        .attr('font-size', tickFont)
        .attr('dy', -4)
        .attr('text-anchor', 'middle')
        .append('textPath')
        .attr('startOffset', '25%')
        .attr('href', '#beyondHearingRange')
        .text('Not in Human Hearing Range')
    rangeGroup.append('text')
        .attr('fill', '#fff')
        .attr('font-size', tickFont)
        .attr('dy', -16)
        .attr('text-anchor', 'middle')
        .append('textPath')
        .attr('startOffset', '25%')
        .attr('href', '#beyondHearingRange')
        .text('(Max/Min: 22.05kHz/0Hz)')
    
    
    rangeGroup.append('line')
        .attr('id', 'tick1')
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.8)
        .attr('x1', outerRadius * Math.cos(endAngle-angleOffset))
        .attr('y1', outerRadius * Math.sin(endAngle-angleOffset))
        //.attr('x2', (outerRadius+tickSize) * Math.cos(endAngle-angleOffset))
        //.attr('y2', (outerRadius+tickSize) * Math.sin(endAngle-angleOffset))
        .attr('x2', outerRadius * Math.cos(endAngle-angleOffset))
        .attr('y2', outerRadius * Math.sin(endAngle-angleOffset))
        .transition()
            .duration(easeTickTime)
            .ease(easeTick)
            .attr('x2', (outerRadius+tickSize) * Math.cos(endAngle-angleOffset))
            .attr('y2', (outerRadius+tickSize) * Math.sin(endAngle-angleOffset))
    
    rangeGroup.append('text')
        .attr('x', (outerRadius+tickSize) * Math.cos(endAngle-angleOffset)-10)
        .attr('y', (outerRadius+tickSize) * Math.sin(endAngle-angleOffset)-5)
        .attr('fill', '#fff')
        .attr('text-anchor', 'middle')
        .attr('font-size', tickFont)
        .text('20,000Hz')
    
    rangeGroup.append('line')
        .attr('id', 'tick2')
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.8)
        .attr('x1', outerRadius * Math.cos(xLinear(twentyHZ)-angleOffset))
        .attr('y1', outerRadius * Math.sin(xLinear(twentyHZ)-angleOffset))
        .attr('x2', outerRadius * Math.cos(xLinear(twentyHZ)-angleOffset))
        .attr('y2', outerRadius * Math.sin(xLinear(twentyHZ)-angleOffset))
        .transition()
            .duration(easeTickTime)
            .ease(easeTick)
            .attr('x2', (outerRadius+tickSize) * Math.cos(xLinear(twentyHZ)-angleOffset))
            .attr('y2', (outerRadius+tickSize) * Math.sin(xLinear(twentyHZ)-angleOffset))
    
    rangeGroup.append('text')
        .attr('x', outerRadius * Math.cos(xLinear(twentyHZ)-angleOffset))
        .attr('y', outerRadius * Math.sin(xLinear(twentyHZ)-angleOffset)-15)
        .attr('fill', '#fff')
        .attr('text-anchor', 'middle')
        .attr('font-size', tickFont)
        .text('20Hz')
    
    rangeGroup.append('text')
        .attr('fill', '#fff')
        .attr('dy', 12)
        .attr('font-size', tickFont)
        //.attr('text-anchor')
        .append('textPath')
        .attr('startOffset', '70.75%')
        .attr('href', '#hearingRange')
        .text('Human Hearing Range')
    
        rangeGroup.selectAll('text')
            .attr('opacity',0)
            .transition()
                .duration(easeTextTime)
                .ease(easeText)
                .attr('opacity', 1)
    
}
function removeHearingRange(){
    var rangeGroup = d3.selectAll('#rangeGroup');
    var hr = rangeGroup.selectAll('#hearingRange');
    var bhr = rangeGroup.selectAll('#beyondHearingRange');
    var tick1 = rangeGroup.selectAll('#tick1')
    var tick2 = rangeGroup.selectAll('#tick2')
    var text = rangeGroup.selectAll('text')
    hr.transition()
            .duration(easeTickTime/2)
            .ease(easeTick)
            .attrTween('d', () => tweenPathIn(baseArc, hrStart, hrEnd, {startAngle: hrStart, endAngle: hrStart}))
        .on('start', () => hrBtn.attr('pointer-events', 'none'))
        .on('end', () => {hrBtn.attr('pointer-events', 'auto'); rangeGroup.remove();})
    bhr.transition()
            .duration(easeTickTime/2)
            .ease(easeTick)
            .attrTween('d', () => tweenPathIn(baseArc, bhrStart, bhrEnd, {startAngle: bhrEnd, endAngle: bhrEnd}))
    
    tick1.transition()
        .duration(500)
        .ease(easeTickOut)
        .attr('x2', outerRadius * Math.cos(endAngle-angleOffset))
        .attr('y2', outerRadius * Math.sin(endAngle-angleOffset))
    tick2.transition()
        .duration(500)
        .ease(easeTickOut)
        .attr('x2', outerRadius * Math.cos(xLinear(twentyHZ)-angleOffset))
        .attr('y2', outerRadius * Math.sin(xLinear(twentyHZ)-angleOffset))
    text.transition()
        .duration(easeTextTime)
        .ease(d3.easeQuadOut)
        .attr('opacity', 0)
    
        
}

var frequencyBands = ['sub bass', 'bass', 'low midrange', 'midrange', 'upper midrange', 'presence', 'brilliance']
var frequencyBandValues = [20,60,250,500,2000,4000,6000,20000]

function freqScale(band){
    var i = frequencyBands.indexOf(band)
    return [frequencyBandValues[i], frequencyBandValues[i+1]]
}

var ticksVisible = false;
function showTicks(){
    
    var tickGroup = group.append('g').attr('id', 'ticksGroup')
    tickGroup.selectAll('tickLines')
        .data(frequencyBandValues).enter()
        .append('line')
            .attr('id', 'tickLines')
            .attr('stroke-width', 0.8)
            .attr('stroke', '#fff')
            .attr('x1', d => innerRadius * Math.cos(hzScale(d)-angleOffset))
            .attr('y1', d => innerRadius * Math.sin(hzScale(d)-angleOffset))
            .attr('x2', d => innerRadius * Math.cos(hzScale(d)-angleOffset))
            .attr('y2', d => innerRadius * Math.sin(hzScale(d)-angleOffset))
            .transition()
                .duration(easeTickTime)
                .ease(easeTick)
                .attr('x2', d => (innerRadius-tickSize) * Math.cos(hzScale(d)-angleOffset))
                .attr('y2', d => (innerRadius-tickSize) * Math.sin(hzScale(d)-angleOffset))
            
    
    tickGroup.selectAll('tickLineValues')
        .data(frequencyBandValues).enter()
        .append('text')
            .attr('id', 'tickText')
            .attr('fill', '#fff')
            .attr('font-size', '10px')
            .attr('text-anchor', 'middle')
            .attr('x', (d,i) => {
                var xoffset = 20
                if(i == frequencyBandValues.length-1) xoffset = -22
                return (innerRadius-tickSize) * Math.cos(hzScale(d)-angleOffset) - xoffset
            })
            .attr('y', d => (innerRadius-tickSize) * Math.sin(hzScale(d)-angleOffset) + 5)
            .text((d,i) => (i <= 3)?'':(d3.format(',')(d)+' Hz'))
    
    var r;
    var invisibleArc = d3.arc();
    var invisibleArcs = tickGroup.append('g').attr('id', 'invisibleArcs')
        invisibleArcs
        .selectAll('invisibleArcs')
        //.attr('id', 'invisibleArcs')
        .data(frequencyBands).enter()
        .append('path')
            .attr('id', (d,i) => 'pathArc'+i)
            .attr('stroke', (d,i) => (i <=2 )?'#fff':'none')
            .attr('stroke-width', 0.5)
            .attr('stroke-dasharray', 2)
            .attr('fill', 'none')
            .transition()
                .duration(easeTickTime)
                .attrTween('d', (d,i) => {
                    if(i<=2) r = innerRadius - 6;
                    else if(d == 'brilliance') r = innerRadius-8;
                    else r = innerRadius-8;
                    invisibleArc.innerRadius(r).outerRadius(r)
                    var endArc = {startAngle:hzScale(freqScale(d)[0]), endAngle:hzScale(freqScale(d)[1])};
                    return tweenPathIn(invisibleArc, 0, 0, endArc);
                })
            .on('start', (d,i) => (i==6)?tickBtn.attr('pointer-events', 'none'):'')
            .on('end', (d,i) => (i==6)?tickBtn.attr('pointer-events', 'auto'):'')

    tickGroup.selectAll('tickLinesSmall')
        .data(frequencyBandValues.slice(0, 3)).enter()
        .append('line')
            .attr('id', 'smallTickLines')
            .attr('stroke', '#fff')
            .attr('stroke-width', 0.5)
            .attr('stroke-dasharray', 4)
            .attr('x1', (d,i) => (innerRadius-tickSize) * Math.cos(hzScale(d)-angleOffset) + d3.select('#pathArc'+i).node().getTotalLength()/4)
            .attr('y1', d => (innerRadius-tickSize) * Math.sin(hzScale(d)-angleOffset))
            .attr('x2', (d,i) => (innerRadius-tickSize) * Math.cos(hzScale(d)-angleOffset) + d3.select('#pathArc'+i).node().getTotalLength()/4)
            .attr('y2', d => (innerRadius-tickSize) * Math.sin(hzScale(d)-angleOffset))
            .transition()
                .delay(easeTickTime/2)
                .duration(easeTickTime/2)
                .attr('x2', (d,i) => {
                    var subbass = 0;
                    if(i != 0) subbass = 10
                    return (innerRadius-tickSize-15) * Math.cos(hzScale(d)-angleOffset) + d3.select('#pathArc'+i).node().getTotalLength()/4 - 10 + subbass
                })
                .attr('y2', (d,i) => (innerRadius-tickSize-15) * Math.sin(hzScale(d)-angleOffset) + (i*5))
            
    tickGroup.selectAll('textSmall')
        .data(frequencyBandValues.slice(0, 3)).enter()
        .append('text')
            .attr('id', 'tickText')
            .attr('fill', '#fff')
            .attr('font-size', '8px')
            .attr('font-weight', 'lighter')
            .attr('transform', (d,i) => {
                var subbass = 0;
                if(i !=0 )subbass = 10;
                var x = (innerRadius-tickSize-15) * Math.cos(hzScale(d)-angleOffset) + d3.select('#pathArc'+i).node().getTotalLength()/4 - 10 + subbass;
                var y = (innerRadius-tickSize-15) * Math.sin(hzScale(d)-angleOffset) + 5 + (i*5)
                return `translate(${x}, ${y}) rotate(-30)`
            })
            .attr('text-anchor', 'end')
            .text((d,i) => {
                var freqVal = freqScale(frequencyBands[i])
                return '('+freqVal[0]+'-'+freqVal[1]+'Hz'+')'+' '+frequencyBands[i]
            })
    
    tickGroup.selectAll('freqBands')
        .data(frequencyBands).enter()
        .append('text')
            .attr('id', 'freq')
            .attr('fill', '#fff')
            .attr('x', (d,i) => {
                if(d == 'brilliance') return 0;
                var bb = bbox(d);
                var pathLength = d3.select('#pathArc'+i).node().getTotalLength()/4
                return pathLength - (bb.width/2)
            })
            .attr('font-size', (d,i) => (i <= 2)?'4px':tickFont)
        .append('textPath')
            .attr('startOffset', d => (d!='brilliance'?'25%':'75%'))
            .attr('href', (d,i) => '#pathArc'+i)
            .text((d,i) => (i<=2)?'':d)
    
    tickGroup.selectAll('#freq')
        .attr('opacity', 0)
        .transition()
            .duration(easeTextTime)
            .attr('opacity', 1)
    tickGroup.selectAll('#tickText')
        .attr('opacity', 0)
        .transition()
            .delay(easeTickTime/2)
            .duration(easeTextTime/2)
            .attr('opacity', 1)
    
    
}
function removeTicks(){
    var tickGroup = d3.selectAll('#ticksGroup')
    var tickText = tickGroup.selectAll('#tickText')
    var smallTickLines = tickGroup.selectAll('#smallTickLines')
    var tickLines = tickGroup.selectAll('#tickLines')
    var freqs = tickGroup.selectAll('#freq')
    var arcs = tickGroup.select('#invisibleArcs').selectAll('path')
    //console.log(arcs)
    //for(var i=0; i<3; i++) d3.select('#pathArc'+i).attr('stroke', 'none')
    
    tickText.transition()
        .duration(easeTextTime/2)
        .attr('opacity', 0)

    smallTickLines.each(function(){
        var l = d3.select(this); 
        l.transition()
            .duration(easeTextTime/2)
            .attr('x2', l.attr('x1')).attr('y2', l.attr('y1'))}); 
    
    tickLines.each(function(){
        var l = d3.select(this); 
        l.transition()
            .duration(easeTextTime/2)
            .attr('x2', l.attr('x1')).attr('y2', l.attr('y1'))});
    var invisibleArc = d3.arc()
    arcs.transition()
        .duration(easeTickTime)
        .attrTween('d', (d,i) => {
                    if(i<=2) r = innerRadius - 6;
                    else if(d == 'brilliance') r = innerRadius-8;
                    else r = innerRadius-8;
                    invisibleArc.innerRadius(r).outerRadius(r)
                    var s = hzScale(freqScale(d)[0]);
                    var e = hzScale(freqScale(d)[1]);
                    var endArc = {startAngle:0, endAngle:0};
                    return tweenPathIn(invisibleArc, s, e, endArc);
                })
        .on('start', (d,i) => (i==6)?tickBtn.attr('pointer-events', 'none'):'')
        .on('end', (d,i) => {if(i==6){tickGroup.remove();tickBtn.attr('pointer-events', 'auto')}})
    
}


var h = Math.pow(maxValue, pow);
var l = h/2;

var gradient = svg
    .append('defs')
    .append('linearGradient')
        .attr('id', 'circleGradient')
        .attr('gradientTransform', 'rotate(90)')
    gradient.append('stop')
        .attr('offset', '5%')
        .attr('stop-color', d3.interpolatePuRd(colorScale(l)))
    gradient.append('stop')
        .attr('offset', '95%')
        .attr('stop-color', d3.interpolatePuRd(colorScale(h)))

var mainArc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(innerRadius)

var endArc = {startAngle: 0, endAngle: Math.PI*2};

var circlePath = group.append('path')
    .attr('id', 'mainRange')
    .attr('stroke-width', 1)
    .attr('stroke', 'url(#circleGradient)')
    .transition()
        .duration(2000)
        .ease(d3.easeBounceOut)
        .attrTween('d', () => tweenPathIn(mainArc, 0, 0, endArc))



function tweenPathIn(a, s, e, b){
  //b.innerRadius = 0;
  var i = d3.interpolate({startAngle: s, endAngle: e}, b);
  return function(t) { return a(i(t)); };   
}
//from mike bostock example of attrTween use
function tweenPath(b) {
  //b.innerRadius = 0;
  var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
  return function(t) { return arc(i(t)); };
}


//draw lines making play button triangle. make them unfold(but would be cooler with a 'snap' transition)
//better yet a bendy, circular unfolding
//and then quickly remove the straightened out lines and replace with a waveform visualization at 0(flat line)
//so basically play button becomes waveform of song
var btnFF = 'Garamond';
var pBtnFS = '17px';
var aBtnFS = '15px';
var easeBtnTime = 2000;
var easeBtn = d3.easeQuadIn;
var midx = 100;
var btnR = 40;
var btnColor = 'url(#circleGradient)';

function btnClick(btn){
    d3.selectAll('text').attr('font-family', btnFF)
    if(btn.attr('clicked') == 'f') btn.attr('stroke', btnColor).attr('clicked', 't')
    else btn.attr('stroke', '#fff').attr('clicked', 'f')
}

let song = null;
let analyser;
let bufferLength;
let audio;
let dataArray;
let AudioContext;
let source = null;
let audioCtx = null;
function initAudioCtx(){
    AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext()
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = bins * 2;//2048;
    analyser.smooothingTimeConstant = 0;//maybe 0.8
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    analyser.connect(audioCtx.destination)
}
initAudioCtx();
//requestAnimationFrame(tick);
//for drop event
function loadSong(song){
    if(source!=null){
        if(!audio.paused) btnClick(d3.select('#playBtn'))
        audio.currentTime = audio.duration//end song
        //audio.pause()
        source.disconnect(analyser)
        //songChanged = true;
    }
    
    
    audio = new Audio(song)
    if(source == null) requestAnimationFrame(tick);
    source = audioCtx.createMediaElementSource(audio)
    source.connect(analyser)
    
    //audio.play()
    //songChanged = false;
    //requestAnimationFrame(tick)    
}

var btnGroup = svg.append('g')
var playBtn = btnGroup.append('circle')
    .attr('id', 'playBtn')
    .attr('cx', midx)
    .attr('cy', 50)
    .attr('r', btnR)
    .attr('stroke', '#fff')
    .on('click', function() {
        btnClick(d3.select(this))
//        if(audioCtx == null){
//            //initAudioCtx();
//            //loadSong(defaultSong);
//            requestAnimationFrame(tick)
//            //audio.play();
//        }
        if(song == null){
            song = defaultSong;
            loadSong(song)
        }
        play();
        
        
//        if(typeof audio == 'undefined'){
//            const AudioContext = window.AudioContext || window.webkitAudioContext;
//            const audioCtx = new AudioContext() 
//            //const gainNode = audioCtx.createGain()
//            //gainNode.gain.value = 1.5
//            analyser = audioCtx.createAnalyser();
//            //minimum 32
//            analyser.fftSize = bins * 2;//2048;
//            analyser.smooothingTimeConstant = 0;
//            bufferLength = analyser.frequencyBinCount;
//            dataArray = new Uint8Array(bufferLength);
//            //analyser.getByteFrequencyData(dataArray);
//
//
//            audio = new Audio(defaultSong)
//            const source = audioCtx.createMediaElementSource(audio)
//            //source.connect(gainNode)
//            //gainNode.connect(analyser)
//            source.connect(analyser)
//            analyser.connect(audioCtx.destination)
//            //console.log(dataArray)
//            //console.log(audioCtx.sampleRate)
//            audio.play()
//            //console.log('here')
//            requestAnimationFrame(tick)   
//        }
//        else play();
    })

var playBtnText = btnGroup.append('text')
    .attr('x', midx)
    .attr('y', 55)
    .style('font-family', btnFF)
    .attr('text-anchor', 'middle')
    .attr('fill', '#fff')
    .text('Play/Pause')
    .attr('font-size', pBtnFS)

var tickBtn = btnGroup.append('circle')
    .attr('cx', midx + 50)
    .attr('cy', 125)
    .attr('r', btnR)
    .attr('stroke', '#fff')
    .on('click', function() {
        if(!ticksVisible){
            showTicks()
            ticksVisible = true;
        }
        else {
            removeTicks()
            ticksVisible = false;
        }
        btnClick(d3.select(this))
    })

var tickBtnText = btnGroup.append('text')
    .attr('x', midx+50)
    .attr('y', 95)
    .attr('fill', '#fff')
    .attr('text-anchor', 'middle')
    .style('font-family', btnFF)
    .attr('font-size', aBtnFS)
    .text('Inner Annotations On/Off')
    .call(wrap, 20)
    .attr('font-size', aBtnFS)


var hrBtn = btnGroup.append('circle')
    .attr('cx', midx - 50)
    .attr('cy', 125)
    .attr('r', btnR)
    .attr('stroke', '#fff')
    .on('click', function() {
        if(!hrVisible){
            showHearingRange()
            hrVisible = true;
        }
        else {
            removeHearingRange()
            hrVisible = false;
        }
        btnClick(d3.select(this))
    })
var hrBtnText = btnGroup.append('text')
    .attr('x', midx - 50)
    .attr('y', 95)
    .attr('fill', '#fff')
    .attr('text-anchor', 'middle')
    .style('font-size', aBtnFS)
    .attr('font-family', btnFF)
    .text('Outer Annotations On/Off')
    .call(wrap, 20)

btnGroup
    .attr('opacity', 0)
    .transition()
        .duration(easeBtnTime)
        .ease(easeBtn)
        .attr('opacity', 1)

btnGroup.selectAll('circle')
    .attr('cursor', 'pointer')
    .attr('clicked', 'f')

btnGroup.selectAll('text')
    .attr('pointer-events', 'none')

d3.select('#name').attr('pointer-events', 'none')
let rw;
function showDropZone(){
    
    window.addEventListener("dragover",function(e){
        //d3.select('#dropZone').attr('stroke', '#fff')
      e = e || event;
      e.preventDefault();
        
    },false);

    window.addEventListener("drop",function(e){
      e = e || event;
      e.preventDefault();
    },false);
    
    
    rw = (midx+50+btnR)-(midx-50-btnR)
    var rh = btnR*1.5
    
    btnGroup.append('rect')
        .attr('id', 'dropZone')
        .attr('x', (midx-50)-btnR)
        .attr('y', 125+btnR+10)
        .attr('width', rw)
        .attr('rx', 10)
        .attr('ry', 10)
        .attr('height', rh)
        .attr('stroke', '#fff')
        .on('drop', dropHandler)
        .on('dragover', dragOverHandler)
        .on('dragleave', () => d3.select('#dropZone').attr('stroke', '#fff'))
    
    btnGroup.append('text')
        .attr('pointer-events', 'none')
        .attr('font-size', '12px')
        .attr('x', (midx-50)-btnR + (rw/2))
        .attr('fill', '#fff')
        .attr('y', (125+btnR+2.5) + (rh/2))
        .attr('text-anchor', 'middle')
        .text('Drag and Drop Audio File Here')
    
    //d3.select('#fileUpload').on('change', () => console.log('change'))
    btnGroup.append('text')
        .attr('pointer-events', 'auto')
        .attr('cursor', 'pointer')
        .attr('font-size', '12px')
        .attr('x', (midx-50)-btnR + (rw/2))
        .attr('fill', '#fff')
        .attr('y', (125+btnR+22.5) + (rh/2))
        .attr('text-anchor', 'middle')
        .style('text-decoration', 'underline')
        .text('Or Upload')
        .on('click', fileUpload)
    
    
    
    btnGroup.append('text')
        .attr('id', 'songTitle')
        .attr('pointer-events', 'none')
        .attr('font-size', '12px')
        .attr('x', (midx-50)-btnR + (rw/2))
        .attr('fill', '#fff')
        .attr('y', (125+btnR+55) + (rh/2))
        .attr('text-anchor', 'middle')
        .text('')
    d3.selectAll('text').attr('font-family', btnFF)
    
}

function fileChange(){
    var file = d3.select('#fileUpload').node().files
}

function fileUpload(){
    let input = d3.select('#fileUpload')
    input.node().click()
    input.on('change', () => {
        var file = input.node().files[0]
        if(file != null){
            song = URL.createObjectURL(file)
            loadSong(song);
            d3.select('#songTitle').text(file.name).call(wrap, rw)
            d3.select('#dropZone').attr('stroke', '#fff')
        }
    })
}

function dropHandler(ev) {
    ev.preventDefault();
    var file = ev.dataTransfer.files[0]
    song = URL.createObjectURL(file)
    loadSong(song);
    d3.select('#songTitle').text(file.name).call(wrap, rw)
    d3.select('#dropZone').attr('stroke', '#fff')
}
function dragOverHandler(ev) {
    d3.select('#dropZone').attr('stroke', btnColor)
    ev.preventDefault();
}

//showDropZone();
function play(){
    if(audio.paused){
        endBool = true;
        audio.play();
    }
    else audio.pause()
}
function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
            }
        }
    });
}
let start;
let elapsed;
let endBool = true;
function tick(){
    
    analyser.getByteFrequencyData(dataArray);
    
    Chart.attr('d', (d, index) => d.arc.outerRadius(yScale(Math.pow(dataArray[index], pow)))())
        .attr('fill', (d, index) => d3.interpolatePuRd(colorScale(Math.pow(dataArray[index], pow))))
    //console.log(audio.ended)
    requestAnimationFrame(tick)
    if(audio.ended && endBool){
        btnClick(d3.select('#playBtn'));
        endBool = false;
    }
//    if(!audio.ended) requestAnimationFrame(tick)
//    else {
//        analyser.smooothingTimeConstant = 1.0;
//        requestAnimationFrame(endTick)
//    }
}
function endTick(){
    //analyser.smooothingTimeConstant = 1.0;
    console.log('here')
    analyser.getByteFrequencyData(dataArray)
    Chart.attr('d', (d, index) => d.arc.outerRadius(yScale(0))())
        .attr('fill', (d, index) => d3.interpolatePuRd(colorScale(Math.pow(dataArray[index], pow))))
    btnClick(d3.select('#playBtn'))
    
}