<template>
  <div class="msg-div">
    <div class="top-r">
      <!--边角样式-->
    </div>
    <div class="bottom-r"></div>
    <div class="parameter-div">
      <div class="name">{{ msg.name }}</div>
      <div>
        Distance from Sun: <span>{{ data.sunDistance }}</span>
      </div>
      <div>
        Mass: <span>{{ data.weight }}</span>
      </div>
      <div>
        Diameter: <span>{{ data.diameter }}</span>
      </div>
      <div>
        Rotation: <span>{{ data.rotation }}</span>
      </div>
      <div>
        Revolution: <span>{{ data.revolution }}</span>
      </div>
      <div>
        Mean Temperature (C): <span>{{ data.temp }}</span>
      </div>
      <div>
        Centripetal Force (mv^2/r): <span> {{ data.centrip }}</span>
      </div>
      <div>
        Gravitational Force (GmM/r^2): <span> {{ data.grav }}</span>
      </div>
      <div>
      </div>
    </div>
  </div>
</template>
<script>
import gsap from "gsap";
export default {
  props: {
    //星球信息
    msg: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: {},
  data() {
    return {};
  },
  computed: {
    data() {
      return this.msg.data;
    },
  },
  watch: {},
  created() {},
  mounted() {
    this.showMsg();
  },
  methods: {
    showMsg() {
      gsap.fromTo(".msg-div", { x: 200 }, { x: 0, duration: 0.5 });
    },
  },
};
</script>
<style scoped lang='scss'>
.msg-div {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  height: 80%;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  padding: 0px 20px;
  max-width: 200px;
  background-color: rgba(0, 0, 0, 0.7);
  color: rgb(135, 143, 255);
  pointer-events: none;
  user-select: none;
  .top-r {
    position: absolute;
    left: 0;
    top: 0;
    height: 40px;
    width: 40px;
    border-top-left-radius: 20px;
    border-left: 2px solid #878fff;
    border-top: 2px solid #878fff;
  }
  .bottom-r {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 40px;
    width: 40px;
    border-bottom-left-radius: 20px;
    border-left: 2px solid #878fff;
    border-bottom: 2px solid #878fff;
  }
  .parameter-div {
    margin: 0px 0px 40px 0px;
    div {
      font-size: 16px;
      font-weight: 900;
      color: rgba(135, 143, 255, 0.5);
      margin: 10px 0px;
      span {
        color: rgb(135, 143, 255);
      }
    }
    .name {
      margin: 10px 0px 40px 0px;
      font-size: 40px;
      font-weight: 900;
      color: #fff;
    }
  }
  .description {
    pointer-events: all;
    height: 30%;
    overflow: auto;
    font-size: 14px;
    font-weight: 100;
  }
}
</style>
<style scoped>
::-webkit-scrollbar-thumb {
  /*滑块*/
  background-color: #abb0ff;
}
</style>