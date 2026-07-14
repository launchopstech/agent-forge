/// <reference types="react" />

declare namespace React {
  namespace JSX {
    interface IntrinsicElements {
      'forge-chat': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'data-agent-id'?: string
          'data-share-token'?: string
          'data-api-url'?: string
          'data-brand-name'?: string
          'data-brand-color'?: string
          'data-mode'?: 'floating' | 'inline'
          'data-position'?: 'bottom-right' | 'bottom-left'
        },
        HTMLElement
      >
    }
  }
}
