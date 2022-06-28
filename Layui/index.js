layui.define([mods],function(exports){
    exports('mod',api);
});

layui.use(['mod1','mod2'],function(args){
    var mod = layui.mod1;
})