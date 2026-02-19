import { JSX } from 'hono/jsx'
import { jsxRenderer } from 'hono/jsx-renderer'

type Props = {
  children: JSX.Element | JSX.Element[]
}

/**
 * rendererは、Honoアプリケーションのレンダラー関数です。
 * この関数は、JSX要素をHTML文字列に変換します。
 */
export const renderer = jsxRenderer(({ children }: Props): JSX.Element => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Todo App</title>
        <link href="/static/style.css" rel="stylesheet" />
      </head>
      <body>
        <div className="container">{children}</div>
      </body>
    </html>
  )
})
