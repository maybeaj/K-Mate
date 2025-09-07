import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Place } from './place.entity'
import { PlacesService } from './places.service'
import { PlacesController } from './places.controller'

@Module({
	imports: [TypeOrmModule.forFeature([Place])],
	controllers: [PlacesController],
	providers: [PlacesService],
	exports: [TypeOrmModule],
})
export class PlacesModule {}
