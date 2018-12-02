<template>
    <div class="comment">
        <h1>评论</h1>
        <ul class="comments-list">
            <li class="comment-item" v-for="item in CommentsList" :key="item.objectId">
                <div class="item-title">
                    <span class="title-name" v-text="item.name"></span>
                    <span class="title-createdAt" v-text="item.createdAt"></span>
                </div>
                <!--评论回复-->
                <div v-if="item.reply" class="item-reply">
                    <div class="item-title">
                        <span class="title-name" v-text="item.reply.name"></span>
                        <span class="title-createdAt" v-text="item.reply.createdAt"></span>
                    </div>
                    <p class="item-content" v-text="item.reply.content"></p>
                </div>

                <p class="item-content" v-text="item.content"></p>
                <div class="comment-reply">
                    <a href="javascript:void(0)" @click="reply(item.objectId, item.name)" class="reply">回复</a>
                </div>
            </li>
        </ul>
        <!--回复输入栏-->
        <a id="firstAnchor"></a>
        <h1 id="comment-form-title">回复 {{replyName}}</h1>
        <div class="comment-form">
            <el-input class="form-name" v-model="formName" placeholder="你的昵称？"></el-input>
            <el-input class="form-content" type="textarea" :rows="8" :cols="30" placeholder="欢迎发表你的评论-……-" v-model="formContent"></el-input>
            <div class="comment-reply">
                <a @click="submit()" class="reply reply-submit">提交</a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                formName: '',
                formContent: '',
                formReply: '',
                replyName: '',
                articleId: this.$route.query.id,
                CommentsList: []
            }
        },
        created () {
            let _self = this
            this.$Axios.get('/comments', { params: { articleId: _self.$route.query.id } })
                .then(res => {
                    const data = res.data
                    console.log(data)
                    _self.CommentsList = [].slice.call(data).map((item, index, arr) => {
                        if (item.reply) {
                            const replyToId = item.reply
                            let obj = {}
                            let reply = arr.find(data => data.objectId === replyToId)
                            obj.objectId = item.objectId
                            obj.name = item.name
                            obj.createdAt = item.createdAt
                            obj.content = item.content
                            obj.reply = reply

                            return obj
                        }
                        return item
                    })
                })
        },
        computed: {
        },
        methods: {
            submit () {
                if (!this.formName.trim() || !this.formContent.trim()) {
                    this.alertWarn('昵称和内容不可为空!')
                    return
                }
                const replyData = {
                    'name': this.formName,
                    'content': this.formContent,
                    'reply': this.formReply,
                    'articleId': this.articleId
                }
                this.$Axios.post('/comments/create', replyData)
                    .then(response => {
                        console.log(response.data)
                    })
                    .catch(error => {
                        alert(error)
                    })
                this.formContent = ''
                this.replyName = ''
                this.formReply = ''
                this.$Message.success('感谢您的宝贵评论!')
            },
            reply (replyToId, replyToName) {
                this.replyName = replyToName

                const anchor = this.$el.querySelector('#firstAnchor')
                document.body.scrollTop = anchor.offsetTop

                this.formReply = replyToId
            },
            alertWarn (msg) {
                this.$Message.warning(msg)
            }
        }
    }
</script>

<style scoped>
   .comment>h1 {
    border-bottom: 1px dashed #d2d2d2;
    margin: 1rem 1rem 1rem 0;
    font-size: 2rem;
  }
  .comment-item {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    font-size: 1rem;
  }
  .item-title {
    display: flex;
    justify-content: space-between;
    background-color: #f7f7f7;
    padding: .5rem 1rem;
    border-radius: .5rem;
  }
  .title-name {
    font-weight: bold;
  }
  .item-content {
    padding: 1rem;
  }
  .item-reply {
    border: 1px solid #d2d2d2;
    border-radius: .5rem;
    margin: 1rem 1rem .5rem;
    color: #7c7c7c;
  }
  .item-title {
    background-color: #fbfbfb;
  }
  .comment-reply {
    display: flex;
    justify-content: flex-end;
  }
  .reply {
    color: #333;
    padding: 1rem;
    transition: all .4s;
  }
   .reply:hover {
     color: #838383;
     cursor: pointer;
   }
  .comment-form {
    display: flex;
    flex-direction: column;
    padding: 1rem;
  }
  .form-name,
  .form-content {
  // border: 1px solid #d2d2d2;
    margin-bottom: 1rem;
  // padding: 1rem;
    font-size: 1.2rem;
  // border-radius: .5rem;
  }
  .form-content {
    resize: none;
  }
  .comment-reply {
    display: flex;
    justify-content: flex-end;
  }
  .reply-submit {
    border: 1px solid #d2d2d2;
    border-radius: .5rem;
    padding: .6rem 1rem;
    transition: all .4s;
    font-size: 1.1rem;
  }
   .reply-submit:hover {
     background: #838383;
     color: #fff;
     border-color: #838383;
     cursor: pointer;
   }
</style>
