import {
  EntitySubscriberInterface,
  EventSubscriber,
  SoftRemoveEvent,
} from 'typeorm';

@EventSubscriber()
export class SoftRemoveSubscriber implements EntitySubscriberInterface {
  /**
   * Called before entity removal.
   */
  // eslint-disable-next-line class-methods-use-this
  beforeSoftRemove(event: SoftRemoveEvent<any>) {
    const { entity } = event;
    console.log(`BEFORE ENTITY WITH ID ${entity?.id} SOFT REMOVED: `, entity);
  }

  /**
   * Called after entity removal.
   */
  // eslint-disable-next-line class-methods-use-this
  async afterSoftRemove(event: SoftRemoveEvent<any>) {
    console.log(
      `AFTER ENTITY WITH ID ${event?.entityId} SOFT REMOVED: `,
      event.entity,
    );
  }
}
