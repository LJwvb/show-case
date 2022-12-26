import { Service } from "egg";

/**
 * Test Service
 */
export default class Test extends Service {
  /**
   * sayHi to you
   * @param name - your name
   */
  public async sayHi(name: string) {
    return `hi, ${name}`;
  }
  public async test() {
    const user = await this.app.mysql.get("bs_user", { id: 2 });
    return user;
  }
}
