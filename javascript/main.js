var post_api_url="http://awiclass.monoame.com/api/command.php?type=get&name=post"

Vue.component("postbox", {
  template: "#post",
  props: ["post"],
  computed: {
    coverurl (){
      if(this.post.cover.indexOf("http") != -1){
        return this.post.cover
      }else{
        return "http://zashare.org" + this.post.cover
      }
    },
    covercss (){
      return {"background-image": "url(" + this.coverurl + ")"}
    }
  }
})

var vm = new Vue({
  el: "#app",
  data: {
    posts: [],
    filter: ""
  },mounted: function(){
    var vobj = this
    $.get(post_api_url).then(function(res){
      vobj.posts = JSON.parse(res)
    })
  },computed:{
    filter_post: function(){
      var vobj = this
      return this.posts.map(function(post){
        var temp_post = JSON.parse(JSON.stringify(post))
        //建立搜尋後的假文字來改變顏色，不會影響到原始文字
        temp_post.description = temp_post.description.substr(0, 60)
        
        return temp_post
      }).filter(function(inpost){
        var tag = ["title", "description", "name_short"]
        var flag = false
        tag.forEach(function(now_tag){
          if(inpost[now_tag].toLowerCase().indexOf(vobj.filter.toLowerCase()) != -1) {
            flag = true   
          }
        })
        return flag
      }).map((temp_post) => {
        
        if (vobj.filter == "") return temp_post
        
        var tag = ["title", "description", "name_short"]
        tag.forEach(function(now_tag){
          var match_word = temp_post[now_tag].match(new RegExp(vobj.filter, "i"))
          if(match_word){
            temp_post[now_tag] = temp_post[now_tag].replace(
              new RegExp(vobj.filter, "i"), "<span class='highlight'>" + match_word + "</span>")
          }
        })
        return temp_post
      })
    }
  }
})