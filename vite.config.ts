import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from 'path';
import svgLoader from 'vite-svg-loader';
import mpaPlugin from 'vite-plugin-mpa-plus';

export default defineConfig({
  plugins: [
    vue(),
    // https://github.com/jpkleemans/vite-svg-loader/issues/56
    svgLoader({
      svgo: true,
      svgoConfig: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                inlineStyles: {
                  onlyMatchedOnce: false,
                },
              },
            },
          },
        ],
      }
    }),
    mpaPlugin({
      pages: {
        '3d': {
          entry: 'src/main.ts',
          filename: '3d.html',
          template: 'template-3d.html',
          inject: {
            data: {
              title: 'Real-time GitHub Contribution City 2022 | OSS Insight',
              description: 'A 3D city created with GitHub contribution graph, you can see how developers build the open source world with corporations in real-time.',
              keywords: 'GitHub contribution graph,3d GitHub contribution,GitHub city,Real-time GitHub Contribution,live GitHub contribution city,open-source corporation,data flow,pull requests in GitHub',
              home: 'https://live.ossinsight.io/',
              domain: 'live.ossinsight.io',
              image: 'thumbnail.png',
              gtag: 'G-KW4FDPBLLJ',
              gtagContentGroup: 'Realtime3D',
            }
          }
        },
        '': {
          entry: 'src/main.ts',
          filename: 'index.html',
          template: 'template-2d.html',
          inject: {
            data: {
              title: 'Real-time GitHub Contribution Insight | OSS Insight ',
              description: 'Here you can find some insights into GitHub real-time contribution, including pull request events grouped by programming languages, top 5 active repositories and developers last 24 hours.',
              keywords: 'Open Source,GitHub contribution, GitHub Trending, GitHub, pull request, real time, Open Source Programming Language',
              home: 'https://live.ossinsight.io/',
              domain: 'live.ossinsight.io',
              image: 'thumbnail-2d.png',
              gtag: 'G-KW4FDPBLLJ',
              gtagContentGroup: 'Realtime2D',
            }
          }
        }
      }
    }),
  ],
  test: {},
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src/'),
      },
    ],
  },
});
