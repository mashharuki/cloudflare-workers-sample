import { jsxRenderer } from 'hono/jsx-renderer'

/**
 * jsxRendererは、Honoのミドルウェアとして使用される関数です。
 * JSXをHTMLに変換するための機能を提供します。
 * この関数は、Honoアプリケーションのミドルウェアとして登録されることで、
 * JSXを使用してHTMLを生成することができます。
 */
export const renderer = jsxRenderer(({ children }) => {
  return (
    <html>
      <head>
        <link href="/static/style.css" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
})
