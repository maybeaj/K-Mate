import { Controller, Get, Query, ParseEnumPipe, Param, ParseIntPipe } from '@nestjs/common'
import { PlacesService } from './places.service'
import type { PlaceType } from './place.entity'

@Controller('places')
export class PlacesController {
	constructor(private readonly service: PlacesService) {}

	@Get()
	list(
		@Query('type', new ParseEnumPipe(['travel', 'food', 'cafe'] as const, { optional: true }))
		type?: PlaceType,
		@Query() query?: any
	) {
		return this.service.findMany({ ...query, type })
	}

	@Get(':id')
	detail(@Param('id', ParseIntPipe) id: number) {
		return this.service.findOne(id)
	}
}
