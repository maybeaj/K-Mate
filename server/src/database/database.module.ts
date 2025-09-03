import { Global, Module } from "@nestjs/common";
import { DbProvider } from "../common/utils/db.provider";

@Global()
@Module({
	providers: [DbProvider],
	exports: [DbProvider], // ⬅️ 외부에서 DB_POOL 주입 가능
})
export class DatabaseModule {}
