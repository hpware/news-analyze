<script lang="ts" setup>
const ffeed = ref();

try {
    const { data } = await useFetch('/api/rss/google')
    ffeed.value = data.value
  } catch (error) {
    console.error('Error:', error)
  }

</script>

<template>
    <hr/>
    <div v-for="item in ffeed">
        <span>{{ item.title }}
            <span v-if="item.title.includes('.cn') || item.title.includes('健康2.0') || 
                    item.title.includes('中天') || item.title.includes('TVBS') || 
                    item.title.includes('香港01')" 
              class="text-red-500 text-sm">
          &nbsp;- 疑似來自有中資背景公司
        </span>
        </span>
        <h4>{{ item.date }}</h4>
        類似新聞:
        <div v-for="itit in item.content">
            {{ itit }}
            <ul v-for="ititit in itit">
                <li>
                    &nbsp; - {{ ititit.content?.[0].content[0] }} - {{ ititit.content?.[2].content[0] }}
                </li>
            </ul>
        </div>
        <hr/>
    </div>
</template>