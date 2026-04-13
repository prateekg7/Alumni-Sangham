# Dashboard
Introduce some spacing between the cards to make it look less cluttered. 
Remove the complete profile card.

# Landing page
Remove the features and hall of fame section, replace it with a scroll stack. Below the about section, give the header of platform features and thn below it, add scroll stack cards given by the following code:

```
npx jsrepo@latest add https://reactbits.dev/r/ScrollStack-JS-CSS

import ScrollStack, { ScrollStackItem } from './ScrollStack'

<ScrollStack>
  <ScrollStackItem>
    <h2>Card 1</h2>
    <p>This is the first card in the stack</p>
  </ScrollStackItem>
  <ScrollStackItem>
    <h2>Card 2</h2>
    <p>This is the second card in the stack</p>
  </ScrollStackItem>
  <ScrollStackItem>
    <h2>Card 3</h2>
    <p>This is the third card in the stack</p>
  </ScrollStackItem>
</ScrollStack>

import { useLayoutEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import './ScrollStack.css';

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete
}) => {
  const scrollerRef = useRef(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef(null);
  const lenisRef = useRef(null);
  const cardsRef = useRef([]);
  const lastTransformsRef = useRef(new Map());
  const isUpdatingRef = useRef(false);

  const calculateProgress = useCallback((scrollTop, start, end) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value);
  }, []);

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
        scrollContainer: document.documentElement
      };
    } else {
      const scroller = scrollerRef.current;
      return {
        scrollTop: scroller.scrollTop,
        containerHeight: scroller.clientHeight,
        scrollContainer: scroller
      };
    }
  }, [useWindowScroll]);

  const getElementOffset = useCallback(
    element => {
      if (useWindowScroll) {
        const rect = element.getBoundingClientRect();
        return rect.top + window.scrollY;
      } else {
        return element.offsetTop;
      }
    },
    [useWindowScroll]
  );

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    const endElement = useWindowScroll
      ? document.querySelector('.scroll-stack-end')
      : scrollerRef.current?.querySelector('.scroll-stack-end');

    const endElementTop = endElement ? getElementOffset(endElement) : 0;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop = getElementOffset(card);
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jCardTop = getElementOffset(cardsRef.current[j]);
          const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jTriggerStart) {
            topCardIndex = j;
          }
        }

        if (i < topCardIndex) {
          const depthInStack = topCardIndex - i;
          blur = Math.max(0, depthInStack * blurAmount);
        }
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

      if (hasChanged) {
        const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
        const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';

        card.style.transform = transform;
        card.style.filter = filter;

        lastTransformsRef.current.set(i, newTransform);
      }

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });

    isUpdatingRef.current = false;
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData,
    getElementOffset
  ]);

  const handleScroll = useCallback(() => {
    updateCardTransforms();
  }, [updateCardTransforms]);

  const setupLenis = useCallback(() => {
    if (useWindowScroll) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075
      });

      lenis.on('scroll', handleScroll);

      const raf = time => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);

      lenisRef.current = lenis;
      return lenis;
    } else {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      const lenis = new Lenis({
        wrapper: scroller,
        content: scroller.querySelector('.scroll-stack-inner'),
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        gestureOrientationHandler: true,
        normalizeWheel: true,
        wheelMultiplier: 1,
        touchInertiaMultiplier: 35,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075,
        touchInertia: 0.6
      });

      lenis.on('scroll', handleScroll);

      const raf = time => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);

      lenisRef.current = lenis;
      return lenis;
    }
  }, [handleScroll, useWindowScroll]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card')
        : scroller.querySelectorAll('.scroll-stack-card')
    );

    cardsRef.current = cards;
    const transformsCache = lastTransformsRef.current;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      card.style.willChange = 'transform, filter';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform = 'translateZ(0)';
      card.style.webkitTransform = 'translateZ(0)';
      card.style.perspective = '1000px';
      card.style.webkitPerspective = '1000px';
    });

    setupLenis();

    updateCardTransforms();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      stackCompletedRef.current = false;
      cardsRef.current = [];
      transformsCache.clear();
      isUpdatingRef.current = false;
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    scaleDuration,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    setupLenis,
    updateCardTransforms
  ]);

  return (
    <div className={`scroll-stack-scroller ${className}`.trim()} ref={scrollerRef}>
      <div className="scroll-stack-inner">
        {children}
        {/* Spacer so the last pin can release cleanly */}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

export default ScrollStack;

.scroll-stack-scroller {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: visible;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  will-change: scroll-position;
}

.scroll-stack-inner {
  padding: 20vh 5rem 50rem;
  min-height: 100vh;
}

.scroll-stack-card-wrapper {
  position: relative;
}

.scroll-stack-card {
  transform-origin: top center;
  will-change: transform, filter;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
  height: 20rem;
  width: 100%;
  margin: 30px 0;
  padding: 3rem;
  border-radius: 40px;
  box-sizing: border-box;
  /* Improve mobile performance */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  position: relative;
}

.scroll-stack-end {
  width: 100%;
  height: 1px;
}

```
The above is the code for scroll stack. Each card should have an image background with text on top explaining each feature (Like you did in the blogs and directory page). Each image you put should be related to that feature. 

Now below this would be the hall of fame section. 
This section would consist of 7 expandable cards with the following code design 

```
<div class="options">
   <div class="option active" style="--optionBackground:url(https://66.media.tumblr.com/6fb397d822f4f9f4596dff2085b18f2e/tumblr_nzsvb4p6xS1qho82wo1_1280.jpg);">
      <div class="shadow"></div>
      <div class="label">
         <div class="icon">
            <i class="fas fa-walking"></i>
         </div>
         <div class="info">
            <div class="main">Blonkisoaz</div>
            <div class="sub">Omuke trughte a otufta</div>
         </div>
      </div>
   </div>
   <div class="option" style="--optionBackground:url(https://66.media.tumblr.com/8b69cdde47aa952e4176b4200052abf4/tumblr_o51p7mFFF21qho82wo1_1280.jpg);">
      <div class="shadow"></div>
      <div class="label">
         <div class="icon">
            <i class="fas fa-snowflake"></i>
         </div>
         <div class="info">
            <div class="main">Oretemauw</div>
            <div class="sub">Omuke trughte a otufta</div>
         </div>
      </div>
   </div>
   <div class="option" style="--optionBackground:url(https://66.media.tumblr.com/5af3f8303456e376ceda1517553ba786/tumblr_o4986gakjh1qho82wo1_1280.jpg);">
      <div class="shadow"></div>
      <div class="label">
         <div class="icon">
            <i class="fas fa-tree"></i>
         </div>
         <div class="info">
            <div class="main">Iteresuselle</div>
            <div class="sub">Omuke trughte a otufta</div>
         </div>
      </div>
   </div>
   <div class="option" style="--optionBackground:url(https://66.media.tumblr.com/5516a22e0cdacaa85311ec3f8fd1e9ef/tumblr_o45jwvdsL11qho82wo1_1280.jpg);">
      <div class="shadow"></div>
      <div class="label">
         <div class="icon">
            <i class="fas fa-tint"></i>
         </div>
         <div class="info">
            <div class="main">Idiefe</div>
            <div class="sub">Omuke trughte a otufta</div>
         </div>
      </div>
   </div>
   <div class="option" style="--optionBackground:url(https://66.media.tumblr.com/f19901f50b79604839ca761cd6d74748/tumblr_o65rohhkQL1qho82wo1_1280.jpg);">
      <div class="shadow"></div>
      <div class="label">
         <div class="icon">
            <i class="fas fa-sun"></i>
         </div>
         <div class="info">
            <div class="main">Inatethi</div>
            <div class="sub">Omuke trughte a otufta</div>
         </div>
      </div>
   </div>
</div>

<a href="http://victorofvalencia-blog.tumblr.com" target="_blank" class="credit">Photos from Victor of Valencia on tumblr</a>

$optionDefaultColours: #ED5565,#FC6E51,#FFCE54,#2ECC71,#5D9CEC,#AC92EC;

body {
   display:flex;
   flex-direction:row;
   justify-content:center;
   align-items:center;
   overflow:hidden;
   height:100vh;
   
   font-family: 'Roboto', sans-serif;
   transition:.25s;
   @include dark {
      background: #232223;
      color:white;
   }
   .credit {
      position: absolute;
      bottom:20px;
      left:20px;
      
      color:inherit;
   }
   .options {
      display:flex;
      flex-direction:row;
      align-items:stretch;
      overflow:hidden;

      min-width:600px;
      max-width:900px;
      width:calc(100% - 100px);
      
      height:400px;
      
      @for $i from 1 through 4 {
         @media screen and (max-width:798px - $i*80) {
            min-width:600px - $i*80;
            .option:nth-child(#{6-$i}) {
               display:none;
            }
         }
      }
      
      .option {
         position: relative;
         overflow:hidden;

         min-width:60px;
         margin:10px;
         //border:0px solid --defaultColor;

         background:var(--optionBackground, var(--defaultBackground, #E6E9ED));
         background-size:auto 120%;
         background-position:center;

         cursor: pointer;

         transition:.5s cubic-bezier(0.05, 0.61, 0.41, 0.95);

         @for $i from 1 through length($optionDefaultColours) {
            &:nth-child(#{$i}) {
               --defaultBackground:#{nth($optionDefaultColours, $i)};
            }
         }
         &.active {
            flex-grow:10000;
            transform:scale(1);
            
            max-width:600px;
            margin:0px;
            border-radius:40px;
            
            background-size:auto 100%;
            .shadow {
               box-shadow:inset 0 -120px 120px -120px black, inset 0 -120px 120px -100px black;
            }
            .label {
               bottom:20px;
               left:20px;
               .info >div {
                  left:0px;
                  opacity:1;
               }
            }
            /*&:active {
               transform:scale(0.9);
            }*/
         }
         &:not(.active) {
            flex-grow:1;
            
            border-radius:30px;
            .shadow {
               bottom:-40px;
               box-shadow:inset 0 -120px 0px -120px black, inset 0 -120px 0px -100px black;
            }
            .label {
               bottom:10px;
               left:10px;
               .info >div {
                  left:20px;
                  opacity:0;
               }
            }
         }
         .shadow {
            position: absolute;
            bottom:0px;
            left:0px;
            right:0px;
            
            height:120px;
            
            transition:.5s cubic-bezier(0.05, 0.61, 0.41, 0.95);
         }
         .label {
            display:flex;
            position: absolute;
            right:0px;

            height:40px;
            transition:.5s cubic-bezier(0.05, 0.61, 0.41, 0.95);
            .icon {
               display:flex;
               flex-direction:row;
               justify-content:center;
               align-items:center;
               
               min-width:40px;
               max-width:40px;
               height:40px;
               border-radius:100%;

               background-color:white;
               color:var(--defaultBackground);
            }
            .info {
               display:flex;
               flex-direction:column;
               justify-content:center;
               
               margin-left:10px;
               
               color:white;
               
               white-space: pre;
               >div {
                  position: relative;
                  
                  transition:.5s cubic-bezier(0.05, 0.61, 0.41, 0.95), opacity .5s ease-out;
               }
               .main {
                  font-weight:bold;
                  font-size:1.2rem;
               }
               .sub {
                  transition-delay:.1s;
               }
            }
         }
      }
   }
}

$(".option").click(function(){
   $(".option").removeClass("active");
   $(this).addClass("active");
   
});

```
The cards should expand on hover and not on click. The above code does it on click. Also you are free to change the above code to react + js if required. 

End the page with a footer. 
For footer I need you to combine two features.
Take the sticky nature and colors of this particular footer - 
You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
sticky-footer.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { motion, useReducedMotion } from 'motion/react';
import {
	FacebookIcon,
	FrameIcon,
	InstagramIcon,
	LinkedinIcon,
	YoutubeIcon,
} from 'lucide-react';
import { Button } from './button';

interface FooterLink {
	title: string;
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
}
interface FooterLinkGroup {
	label: string;
	links: FooterLink[];
}

type StickyFooterProps = React.ComponentProps<'footer'>;

export function StickyFooter({ className, ...props }: StickyFooterProps) {
	return (
		<footer
			className={cn('relative h-[720px] w-full', className)}
			style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
			{...props}
		>
			<div className="fixed bottom-0 h-[720px] w-full">
				<div className="sticky top-[calc(100vh-720px)] h-full overflow-y-auto">
					<div className="relative flex size-full flex-col justify-between gap-5 border-t px-4 py-8 md:px-12">
						<div
							aria-hidden
							className="absolute inset-0 isolate z-0 contain-strict"
						>
							<div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)] absolute top-0 left-0 h-320 w-140 -translate-y-87.5 -rotate-45 rounded-full" />
							<div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 left-0 h-320 w-60 [translate:5%_-50%] -rotate-45 rounded-full" />
							<div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 left-0 h-320 w-60 -translate-y-87.5 -rotate-45 rounded-full" />
						</div>
						<div className="mt-10 flex flex-col gap-8 md:flex-row xl:mt-0">
							<AnimatedContainer className="w-full max-w-sm min-w-2xs space-y-4">
								<FrameIcon className="size-8" />
								<p className="text-muted-foreground mt-8 text-sm md:mt-0">
									Innovative fintech empowering businesses with seamless
									payments, lending, and financial infrastructure worldwide.
								</p>
								<div className="flex gap-2">
									{socialLinks.map((link) => (
										<Button size="icon" variant="outline" className="size-8">
											<link.icon className="size-4" />
										</Button>
									))}
								</div>
							</AnimatedContainer>
							{footerLinkGroups.map((group, index) => (
								<AnimatedContainer
									key={group.label}
									delay={0.1 + index * 0.1}
									className="w-full"
								>
									<div className="mb-10 md:mb-0">
										<h3 className="text-sm uppercase">{group.label}</h3>
										<ul className="text-muted-foreground mt-4 space-y-2  text-sm md:text-xs lg:text-sm">
											{group.links.map((link) => (
												<li key={link.title}>
													<a
														href={link.href}
														className="hover:text-foreground inline-flex items-center transition-all duration-300"
													>
														{link.icon && <link.icon className="me-1 size-4" />}
														{link.title}
													</a>
												</li>
											))}
										</ul>
									</div>
								</AnimatedContainer>
							))}
						</div>
						<div className="text-muted-foreground flex flex-col items-center justify-between gap-2 border-t pt-2 text-sm md:flex-row">
							<p>© 2025 Cognition, Inc. All rights reserved.</p>
							<p>asme inc.</p>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}

const socialLinks = [
	{ title: 'Facebook', href: '#', icon: FacebookIcon },
	{ title: 'Instagram', href: '#', icon: InstagramIcon },
	{ title: 'Youtube', href: '#', icon: YoutubeIcon },
	{ title: 'LinkedIn', href: '#', icon: LinkedinIcon },
];

const footerLinkGroups: FooterLinkGroup[] = [
	{
		label: 'Product',
		links: [
			{ title: 'Payments', href: '#' },
			{ title: 'Cards & Issuing', href: '#' },
			{ title: 'Lending & Credit', href: '#' },
			{ title: 'Wealth Management', href: '#' },
			{ title: 'Insurance', href: '#' },
			{ title: 'Crypto Wallets', href: '#' },
			{ title: 'FX & Currency Exchange', href: '#' },
			{ title: 'Treasury Management', href: '#' },
			{ title: 'Merchant Services', href: '#' },
			{ title: 'Point of Sale', href: '#' },
			{ title: 'Embedded Finance', href: '#' },
			{ title: 'Open Banking API', href: '#' },
			{ title: 'SDKs & Integrations', href: '#' },
			{ title: 'Pricing', href: '#' },
		],
	},
	{
		label: 'Solutions',
		links: [
			{ title: 'Startups', href: '#' },
			{ title: 'Enterprises', href: '#' },
			{ title: 'Marketplaces', href: '#' },
			{ title: 'Freelancers', href: '#' },
			{ title: 'E-commerce', href: '#' },
			{ title: 'Banks & Credit Unions', href: '#' },
			{ title: 'Investment Platforms', href: '#' },
			{ title: 'Insurance Providers', href: '#' },
			{ title: 'Payment Gateways', href: '#' },
			{ title: 'Government & Public Sector', href: '#' },
			{ title: 'Nonprofits', href: '#' },
			{ title: 'Education', href: '#' },
			{ title: 'Healthcare', href: '#' },
		],
	},
	{
		label: 'Resources',
		links: [
			{ title: 'Blog', href: '#' },
			{ title: 'Case Studies', href: '#' },
			{ title: 'Documentation', href: '#' },
			{ title: 'API Reference', href: '#' },
			{ title: 'Developer Tools', href: '#' },
			{ title: 'Guides & Tutorials', href: '#' },
			{ title: 'Whitepapers', href: '#' },
			{ title: 'Reports & Research', href: '#' },
			{ title: 'Events & Webinars', href: '#' },
			{ title: 'E-books', href: '#' },
			{ title: 'Community Forum', href: '#' },
			{ title: 'Release Notes', href: '#' },
			{ title: 'System Status', href: '#' },
		],
	},
	{
		label: 'Company',
		links: [
			{ title: 'About Us', href: '#' },
			{ title: 'Leadership', href: '#' },
			{ title: 'Careers', href: '#' },
			{ title: 'Press', href: '#' },
			{ title: 'Sustainability', href: '#' },
			{ title: 'Diversity & Inclusion', href: '#' },
			{ title: 'Investor Relations', href: '#' },
			{ title: 'Partners', href: '#' },
			{ title: 'Legal & Compliance', href: '#' },
			{ title: 'Privacy Policy', href: '#' },
			{ title: 'Cookie Policy', href: '#' },
			{ title: 'Terms of Service', href: '#' },
			{ title: 'AML & KYC Policy', href: '#' },
			{ title: 'Regulatory Disclosures', href: '#' },
		],
	},
];

type AnimatedContainerProps = React.ComponentProps<typeof motion.div> & {
	children?: React.ReactNode;
	delay?: number;
};

function AnimatedContainer({
	delay = 0.1,
	children,
	...props
}: AnimatedContainerProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return children;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.8 }}
			{...props}
		>
			{children}
		</motion.div>
	);
}


demo.tsx
import React from 'react';
import { StickyFooter } from "@/components/ui/sticky-footer";
import Lenis from '@studio-freight/lenis';
import { ArrowDownIcon } from 'lucide-react';

export default function DemoOne() {
	React.useEffect(() => {
		const lenis = new Lenis();

		function raf(time: number) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);
	}, []);

	return (
		<div className="relative w-full">
			<div className="flex h-screen flex-col items-center justify-center gap-10">
				<h1 className="max-w-xl text-center">
					<span className="text-foreground/80 text-4xl font-semibold">
						example of
					</span>
					<br />
					<span className="text-5xl font-bold">Sticky Footer</span>
				</h1>
				<div className="flex items-center gap-2">
					<p>Scroll down</p>
					<ArrowDownIcon className="size-4" />
				</div>
			</div>
			<StickyFooter />
		</div>
	);
}

```

Copy-paste these files for dependencies:
```tsx
shadcn/button
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }

```

Install NPM dependencies:
```bash
motion, lucide-react, @radix-ui/react-slot, class-variance-authority
```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

And for the motion part, copy only the flames like feature from the below code:

```
div.main
div.footer
    div.bubbles
        - for (var i = 0; i < 128; i++) //Small numbers looks nice too
            div.bubble(style=`--size:${2+Math.random()*4}rem; --distance:${6+Math.random()*4}rem; --position:${-5+Math.random()*110}%; --time:${2+Math.random()*2}s; --delay:${-1*(2+Math.random()*2)}s;`)
    div.content
        div
            div
                b Eldew
                a(href="#") Secuce
                a(href="#") Drupand
                a(href="#") Oceash
                a(href="#") Ugefe
                a(href="#") Babed
            div
                b Spotha
                a(href="#") Miskasa
                a(href="#") Agithe
                a(href="#") Scesha
                a(href="#") Lulle
            div
                b Chashakib
                a(href="#") Chogauw
                a(href="#") Phachuled
                a(href="#") Tiebeft
                a(href="#") Ocid
                a(href="#") Izom
                a(href="#") Ort
            div
                b Athod
                a(href="#") Pamuz
                a(href="#") Vapert
                a(href="#") Neesk
                a(href="#") Omemanen
        div
            a.image(href="https://codepen.io/z-" target="_blank" style="background-image: url(\"https://s3-us-west-2.amazonaws.com/s.cdpn.io/199011/happy.svg\")")
            p ©2019 Not Really
svg(style="position:fixed; top:100vh")
    defs
        filter#blob
            feGaussianBlur(in="SourceGraphic" stdDeviation="10" result="blur")
            feColorMatrix(in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="blob")
            //feComposite(in="SourceGraphic" in2="blob" operator="atop") //After reviewing this after years I can't remember why I added this but it isn't necessary for the blob effect

body {
    display:grid;
    grid-template-rows: 1fr 10rem auto;
    grid-template-areas:"main" "." "footer";
    overflow-x:hidden;
    background:#F5F7FA;
    min-height:100vh;
    font-family: 'Open Sans', sans-serif;
    .footer {
        z-index: 1;
        --footer-background:#ED5565;
        display:grid;
        position: relative;
        grid-area: footer;
        min-height:12rem;
        .bubbles {
            position: absolute;
            top:0;
            left:0;
            right:0;
            height:1rem;
            background:var(--footer-background);
            filter:url("#blob");
            .bubble {
                position: absolute;
                left:var(--position, 50%);
                background:var(--footer-background);
                border-radius:100%;
                animation:bubble-size var(--time, 4s) ease-in infinite var(--delay, 0s),
                    bubble-move var(--time, 4s) ease-in infinite var(--delay, 0s);
                transform:translate(-50%, 100%);
            }
        }
        .content {
            z-index: 2;
            display:grid;
            grid-template-columns: 1fr auto;
            grid-gap: 4rem;
            padding:2rem;
            background:var(--footer-background);
            a, p {
                color:#F5F7FA;
                text-decoration:none;
            }
            b {
                color:white;
            }
            p {
                margin:0;
                font-size:.75rem;
            }
            >div {
                display:flex;
                flex-direction:column;
                justify-content: center;
                >div {
                    margin:0.25rem 0;
                    >* {
                        margin-right:.5rem;
                    }
                }
                .image {
                    align-self: center;
                    width:4rem;
                    height:4rem;
                    margin:0.25rem 0;
                    background-size: cover;
                    background-position: center;
                }
            }
        }
    }
}

@keyframes bubble-size {
    0%, 75% {
        width:var(--size, 4rem);
        height:var(--size, 4rem);
    }
    100% {
        width:0rem;
        height:0rem;
    }
}
@keyframes bubble-move {
    0% {
        bottom:-4rem;
    }
    100% {
        bottom:var(--distance, 10rem);
    }
}

```

So the final footer is a sticky footer which pops up after scroll and when reaching the end, the gooey nature appears with blobs rising from the top part (both codes have been given to you, donot blindly copy paste, adhere to my guidelines).

# Referral Requests page
Build a minimlistic skeleton page for the referral requests. For alumni they would see what all requests they have received and for students it would show what all requests they have sent. You are free to design this however you want (just dont connect it to backend as of now).

# WHAT NOT TO DO
Do not make changes in any backend code. Only make frontend changes and whatever is stated. No changes should be made in files which have no relevance with the above instruction. The tech stack should be react + JS not typescript. 