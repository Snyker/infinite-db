"use client"

import React, {forwardRef, HTMLAttributes} from "react";
import {cva} from "class-variance-authority";
import {cn} from "@/lib/utils";

interface ITypography extends HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
}


const typo1Variants = cva(
  "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
)
const TypographyH1 = forwardRef<
  HTMLHeadingElement,
  ITypography
>(({ className, children, ...props}, ref) => {
  return (
    <h1 className={cn(typo1Variants, className)} ref={ref} {...props}>
      {children}
    </h1>
  )
})


const typo2Variants = cva(
  "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"
)
const TypographyH2 = forwardRef<
  HTMLHeadingElement,
  ITypography
>(({ className, children, ...props}, ref) => {
  return (
    <h2 className={cn(typo2Variants, className)} ref={ref} {...props}>
      {children}
    </h2>
  )
})


const typo3Variants = cva(
  "scroll-m-20 text-2xl font-semibold tracking-tight"
)
const TypographyH3 = forwardRef<
  HTMLHeadingElement,
  ITypography
>(({ className, children, ...props}, ref) => {
  return (
    <h3 className={cn(typo3Variants, className)} ref={ref} {...props}>
      {children}
    </h3>
  )
})


const typo4Variants = cva(
  "scroll-m-20 text-xl font-semibold tracking-tight"
)
const TypographyH4 = forwardRef<
  HTMLHeadingElement,
  ITypography
>(({ className, children, ...props}, ref) => {
  return (
    <h4 className={cn(typo4Variants, className)} ref={ref} {...props}>
      {children}
    </h4>
  )
})


const TypographyP = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props}, ref) => {
  return (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)} ref={ref} {...props}>
      {children}
    </p>
  )
})


const TypographyBlockquote = forwardRef<
  HTMLQuoteElement,
  React.BlockquoteHTMLAttributes<HTMLQuoteElement>
>(({ className, children, ...props}, ref) => {
  return (
    <blockquote className={cn("mt-6 border-l-2 pl-6 italic", className)} ref={ref} {...props}>
      {children}
    </blockquote>
  )
})


const TypographyLead = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props}, ref) => {
  return (
    <p className={cn("text-xl text-muted-foreground", className)} ref={ref} {...props}>
      {children}
    </p>
  )
})


const TypographyLarge = forwardRef<
  HTMLSpanElement,
  HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props}, ref) => {
  return (
    <span className={cn("text-lg font-semibold", className)} ref={ref} {...props}>
      {children}
    </span>
  )
})


const TypographySmall = forwardRef<
  HTMLElement,
  HTMLAttributes<HTMLElement>
>(({ className, children, ...props}, ref) => {
  return (
    <small className={cn("text-sm font-medium leading-none", className)} ref={ref} {...props}>
      {children}
    </small>
  )
})

const TypographyMuted = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props}, ref) => {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} ref={ref} {...props}>
      {children}
    </p>
  )
})

export {
  TypographyBlockquote,
  TypographyH1,
  TypographyMuted,
  TypographyLarge,
  TypographySmall,
  TypographyH2,
  TypographyH3,
  TypographyLead,
  TypographyH4,
  TypographyP
}
