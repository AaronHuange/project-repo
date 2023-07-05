import { EntitySubscriberInterface, EventSubscriber } from 'typeorm';
import { RecoverEvent } from 'typeorm/subscriber/event/RecoverEvent';

@EventSubscriber()
export class RecoverSubscriber implements EntitySubscriberInterface {
  /**
   * Called before entity is recovered in the database.
   */
  // eslint-disable-next-line class-methods-use-this
  beforeRecover?(event: RecoverEvent<any>) {
    console.log(
      `BEFORE ENTITY WITH ID ${event.entityId} RECOVERED: `,
      event.entity,
    );
  }

  /**
   * Called after entity recovery.
   */
  // eslint-disable-next-line class-methods-use-this
  async afterRecover(event: RecoverEvent<any>) {
    console.log(
      `AFTER ENTITY WITH ID ${event.entityId} RECOVERED: `,
      event.entity,
    );
  }
}
