import React from 'react'
import type { AnchorHTMLAttributes } from 'react'

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string | { pathname?: string; query?: Record<string, string> }
  prefetch?: boolean
  replace?: boolean
  scroll?: boolean
  shallow?: boolean
  passHref?: boolean
  legacyBehavior?: boolean
  as?: string
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      href,
      prefetch: _prefetch,
      replace: _replace,
      scroll: _scroll,
      shallow: _shallow,
      passHref: _passHref,
      legacyBehavior,
      as: _as,
      children,
      ...rest
    },
    ref
  ) => {
    const resolvedHref = typeof href === 'string' ? href : (href.pathname ?? '#')
    if (legacyBehavior) {
      return React.isValidElement(children) ? (
        React.cloneElement(children as React.ReactElement<{ href: string }>, { href: resolvedHref })
      ) : (
        <a ref={ref} href={resolvedHref} {...rest}>
          {children}
        </a>
      )
    }
    return (
      <a ref={ref} href={resolvedHref} {...rest}>
        {children}
      </a>
    )
  }
)
Link.displayName = 'Link'

export default Link
