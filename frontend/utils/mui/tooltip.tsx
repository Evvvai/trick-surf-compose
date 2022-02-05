import { styled } from '@mui/material/styles'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'

export const TopTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'var(--color-background-modal-content)',
    color: 'var(--color-text-invert)',
    fontSize: '1rem',
  },
}))

export const ActivityTooltip = styled(
  ({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  )
)(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'var(--color-background-modal-content)',
    color: 'var(--color-text-invert)',
    fontSize: '1rem',
  },
}))

export const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'var(--color-background-modal-content)',
    color: 'var(--color-text-invert)',
    fontSize: '1rem',
  },
}))
