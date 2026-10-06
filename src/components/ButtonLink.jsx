import { Link } from 'react-router-dom';

/** One component for every link-styled button (internal route, external URL, download, disabled). */
export default function ButtonLink({ href, to, variant = 'primary', size, icon: Icon, iconRight: IconRight, external, download, disabled, children, className = '', onClick, ...rest }) {
  const cls = `btn btn-${variant} ${size === 'sm' ? 'btn-sm' : ''} ${className}`;
  const inner = (
    <>
      {Icon && <Icon size={size === 'sm' ? 15 : 18} aria-hidden="true" />}
      <span>{children}</span>
      {IconRight && <IconRight size={size === 'sm' ? 15 : 18} aria-hidden="true" />}
    </>
  );
  if (disabled || (!href && !to && !onClick)) {
    return <span className={`${cls} cursor-not-allowed opacity-55`} aria-disabled="true" {...rest}>{inner}</span>;
  }
  if (to) return <Link to={to} className={cls} onClick={onClick} {...rest}>{inner}</Link>;
  if (!href) return <button type="button" className={cls} onClick={onClick} {...rest}>{inner}</button>;
  return (
    <a
      href={href}
      className={cls}
      onClick={onClick}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...(download ? { download: typeof download === 'string' ? download : true } : {})}
      {...rest}
    >
      {inner}
    </a>
  );
}
