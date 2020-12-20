<template>
  <div class="close-button" @click="$emit('click')" ><span></span><span></span></div>
</template>

<script>
export default {
  name: 'CloseButton',
};
</script>

<style scoped>
.close-button
{
  position: relative;
  width: 12px;
  height: 12px;
  cursor: pointer;
}

.close-button span
{
  position: absolute;
  top: 5px;
  left: -1px;
  width: 14px;
  height: 1px;
  background: #fff;
}

.close-button span:nth-child(1)
{
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);
}

.close-button span:nth-child(2)
{
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  transform: rotate(-45deg);
}
</style>
