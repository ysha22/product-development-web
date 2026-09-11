import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    // 단일 HTML 파일 생성을 위해 CSS도 인라인으로 처리
    cssCodeSplit: false,
    assetsInlineLimit: 100_000_000, // 모든 assets를 인라인으로 포함
    rollupOptions: {
      output: {
        // 모든 JS를 하나의 청크로 합치기
        inlineDynamicImports: true,
      },
    },
  },
})
