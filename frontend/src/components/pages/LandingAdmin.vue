<template>
  <div class="main">
    <div class="book-background">
      <div v-for="(book, index) in backgroundBooks" :key="index" 
           :class="['background-book', { 'book-animated': book.animated }]"
           :style="{ 
             backgroundColor: book.color, 
             top: book.top, 
             left: book.left, 
             transform: `rotate(${book.rotation}deg)`,
             width: book.width,
             height: book.height
           }">
        <div class="book-spine"></div>
      </div>
    </div>
    <div class="content">
      <div class="hello">
        <img :src="require('@/assets/logo.png')" alt="CasacemLogo">
      </div>
      <h2 class="text1">Panel de Administracion de biblioteca</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    title: String,
    msg: String
  },
  data() {
    return {
      backgroundBooks: this.generateBackgroundBooks(200)
    }
  },
  methods: {
    generateBackgroundBooks(count) {
      const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#e67e22'];
      return Array.from({ length: count }, (_, index) => ({
        color: colors[Math.floor(Math.random() * colors.length)],
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        rotation: Math.random() * 360,
        width: `${30 + Math.random() * 30}px`,
        height: `${100 + Math.random() * 100}px`,
        animated: index % 10 === 0 // Only animate every 10th book
      }));
    }
  }
}
</script>

<style scoped>
.main {
  background-color: rgb(255, 255, 255);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.book-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.background-book {
  position: absolute;
  perspective: 1000px;
  transform-style: preserve-3d;
}

.book-spine {
  position: absolute;
  left: -5px;
  top: 0;
  bottom: 0;
  width: 10px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 2px 0 0 2px;
}

.content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: rgba(255, 255, 255, 0.7);
}

.hello {
  text-align: center;
  padding: 20px;
}

.text1 {
  font-size: 1.5em;
  text-align: center;
  padding: 20px;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(3deg);
  }
}

.book-animated {
  animation: float 6s ease-in-out infinite;
}

.book-animated:nth-child(odd) {
  animation-delay: 0.5s;
}

.book-animated:nth-child(even) {
  animation-delay: 1s;
}
</style>