import { Fragment } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

interface ISubscriberMetricsItem {
  logo: string;
  logoDark?: string;
  info: string;
  desc: string;
  path: string;
}
type ISubscriberMetricsItems = Array<ISubscriberMetricsItem>;

const SubscriberMetrics = () => {
  const items: ISubscriberMetricsItems = [
    { logo: 'linkedin-2.svg', info: '9.3k', desc: 'Amazing mates', path: '' },
    { logo: 'youtube-2.svg', info: '24k', desc: 'Lessons Views', path: '' },
    {
      logo: 'instagram-03.svg',
      info: '608',
      desc: 'New subscribers',
      path: '',
    },
    {
      logo: 'tiktok.svg',
      logoDark: 'tiktok-dark.svg',
      info: '2.5k',
      desc: 'Stream audience',
      path: '',
    },
  ];

  const renderItem = (item: ISubscriberMetricsItem, index: number) => {
    return (
      <Card key={index} className="h-full">
        <CardContent className="p-0 flex flex-col justify-between gap-4 h-full bg-cover rtl:bg-[left_top_-1.7rem] bg-[right_top_-1.7rem] bg-no-repeat channel-stats-bg">
          {item.logoDark ? (
            <>
              <Image
                src={`/media/brand-logos/${item.logo}`}
                className="dark:hidden w-6 mt-3 ms-4"
                alt="image"
                width={24}
                height={24}
              />
              <Image
                src={`/media/brand-logos/${item.logoDark}`}
                className="light:hidden w-6 mt-3 ms-4"
                alt="image"
                width={24}
                height={24}
              />
            </>
          ) : (
            <Image
              src={`/media/brand-logos/${item.logo}`}
              className="w-6 mt-3 ms-4"
              alt="image"
              width={24}
              height={24}
            />
          )}
          <div className="flex flex-col gap-0.5 pb-3 px-4">
            <span className="text-2xl font-semibold text-foreground">
              {item.info}
            </span>
            <span className="text-xs font-normal text-muted-foreground">
              {item.desc}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Fragment>
      <style jsx>{`
        .channel-stats-bg {
          background-image: url('/media/images/2600x1600/bg-3.png');
        }
        .dark .channel-stats-bg {
          background-image: url('/media/images/2600x1600/bg-3-dark.png');
        }
      `}</style>

      <div className="grid grid-cols-2 gap-3">
        {items.map((item, index) => {
          return renderItem(item, index);
        })}
      </div>
    </Fragment>
  );
};

export { SubscriberMetrics, type ISubscriberMetricsItem, type ISubscriberMetricsItems };
